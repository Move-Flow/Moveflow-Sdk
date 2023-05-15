// import { JsonRpcProvider } from "@mysten/sui.js";
import { AptosAccount, AptosClient, HexString, Types } from "aptos";
import { AccountKeys, Wallet, WalletAdapter } from '@manahippo/aptos-wallet-adapter';
import { CONFIGS } from "../config";
import StreamInfo from "../types/streamInfo";
import { NetworkConfiguration } from "../config";
import BigNumber from 'bignumber.js';
import { StreamStatus } from "../types/streamStatus";

export const aptosConfigType = "stream::GlobalConfig";
export const aptosStreamType = "stream::StreamInfo"


export interface NetworkAdapter {

    getProvider(): AptosClient;

    getWallet(): WalletAdapter;

    getAddress(): string;

    getBalance(): Promise<string>;

    getIncomingStreams(recipientAddress: string): Promise<StreamInfo[]>;

    getOutgoingStreams(senderAddress: string): Promise<StreamInfo[]>;

    sendTransaction(from: string, to: string, amount: number): string;

    getTransactionStatus(hash: string): string;

    displayAmount(amount: BigNumber): string;

    query(address: string, side: 'incoming' | 'outgoing') : Promise<StreamInfo[]>;
    
    create(
        name: string,
        remark: string,
        recipientAddr: string,
        depositAmount: number,
        startTime: string,
        stopTime: string,
        interval: number, 
        canPause?: boolean,
        closeable?: boolean,
        recipientModifiable?: boolean
    ): void;

    close(stream_id: string) : Promise<void>;
    
    pause(stream_id: string) : Promise<void>;
    resume(stream_id: string) : Promise<void>;

    withdraw(coin_id: string, stream_id: string) : Promise<void>;

}

class AptAdapter implements NetworkAdapter {
    private client: AptosClient;

    private account: AptosAccount;

    private wallet: Wallet;

    private contract: string;

    // The constructor takes a web3 provider as an argument
    constructor(connection: NetworkConfiguration, account: AptosAccount, wallet: Wallet) {
        console.debug("AptAdapter constructor connection:", connection)
        this.client = new AptosClient(connection.fullNodeUrl);
        this.account = account;
        this.wallet = wallet;
        this.contract = CONFIGS.aptos_testnet.contract;
    }

    getWallet(): WalletAdapter {
        return this.wallet.adapter;
    }

    getAddress(): string {
        return this.account.address.toString();
    }

    getProvider(): AptosClient {
        return this.client;
    }

    async getBalance() {
        const resources = await this.client.getAccountResources(this.account.address.toString());
        const coin = resources.find((r) => r.type.includes('0x1::aptos_coin::AptosCoin'));
        console.debug("AptAdapter coin:", coin);
        if (typeof coin == "undefined") {
            return "0";
        }
        // @ts-ignore
        return this.displayAmount(new BigNumber(coin.data.coin.value));
    }

    async getIncomingStreams(recvAddress: string): Promise<StreamInfo[]> {
        const currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))
        console.log('recevAddr', recvAddress);
        const address = this.contract;
        const event_handle = `${address}::${aptosConfigType}`;
        const eventField = "stream_events";
        const eventsAll = await this.client.getEventsByEventHandle(
            address,
            event_handle,
            eventField,
            {
                start: BigInt(0),
                limit: 300,
            }
        );
        // console.debug("AptAdapter getIncomingStreams events", eventsAll);

        const eventsRecv = eventsAll.filter(event => event.data.recipient! === recvAddress);
        if (eventsRecv.length === 0) return [];

        const streamIds = eventsRecv.map(event => event.data.id!);
        // console.debug("AptAdapter getIncomingStreams streamIds", streamIds);

        const resources = await this.client.getAccountResources(address);
        // console.debug("AptAdapter getIncomingStreams resources:", resources);
        const resGlConf = resources.find((r) => r.type.includes(aptosConfigType))!;
        // @ts-ignore
        const inStreamHandle = resGlConf.data.streams_store.inner.handle!;
        let streams: StreamInfo[] = [];
        for (const streamId of streamIds) {
            const tbReqStreamInd = {
                key_type: "u64",
                value_type: `${address}::${aptosStreamType}`,
                key: streamId,
            };
            // console.debug("AptAdapter getIncomingStreams inStreamHandle, tbReqStreamInd", streamId, inStreamHandle, tbReqStreamInd);
            const stream = await this.client.getTableItem(inStreamHandle, tbReqStreamInd);
            const status = this.getStatus(stream, currTime)
            const withdrawableAmount = this.calculateWithdrawableAmount(
                Number(stream.start_time) * 1000,
                Number(stream.stop_time) * 1000,
                Number(currTime),
                Number(stream.pauseInfo.pause_at) * 1000,
                Number(stream.last_withdraw_time) * 1000,
                Number(stream.pauseInfo.acc_paused_time) * 1000,
                Number(stream.interval),
                Number(stream.rate_per_interval),
                status,
            )
            const streamedAmount = this.calculateStreamedAmount(
                Number(stream.withdrawn_amount),
                Number(stream.start_time) * 1000,
                Number(stream.stop_time) * 1000,
                Number(currTime),
                Number(stream.pauseInfo.pause_at) * 1000,
                Number(stream.last_withdraw_time) * 1000,
                Number(stream.pauseInfo.acc_paused_time) * 1000,
                Number(stream.interval),
                Number(stream.rate_per_interval),
                status,
            );
            streams.push({
                name: stream.name,
                status: status,
                createTime: (Number(stream.create_time) * 1000).toString(),
                depositAmount: this.displayAmount(new BigNumber(stream.deposit_amount)),
                streamId: stream.id,
                interval: stream.interval,
                lastWithdrawTime: stream.last_withdraw_time,
                ratePerInterval: stream.rate_per_interval,
                recipientId: stream.recipient,
                remainingAmount: this.displayAmount(new BigNumber(stream.remaining_amount)),
                senderId: stream.sender,
                startTime: (Number(stream.start_time) * 1000).toString(),
                stopTime: (Number(stream.stop_time) * 1000).toString(),
                withdrawnAmount: this.displayAmount(new BigNumber(stream.withdrawn_amount)),
                pauseInfo: {
                    accPausedTime: stream.pauseInfo.acc_paused_time,
                    pauseAt: (Number(stream.pauseInfo.pause_at) * 1000).toString(),
                    paused: stream.pauseInfo.paused,
                },
                streamedAmount: this.displayAmount(new BigNumber(streamedAmount)).toString(),
                withdrawableAmount: this.displayAmount(new BigNumber(withdrawableAmount)).toString(),
                escrowAddress: stream.escrow_address,
            });
            // console.log('stream___', stream);
        }
        console.debug("AptAdapter getIncomingStreams streams", streams);
        return streams;
    }

    async getOutgoingStreams(sendAddress: string): Promise<StreamInfo[]> {
        const event_handle = `${this.contract}::${aptosConfigType}`;
        const eventField = "stream_events";
        const eventsAll = await this.client.getEventsByEventHandle(
            sendAddress,
            event_handle,
            eventField,
            {
                start: BigInt(0),
                limit: 300,
            }
        );
        // console.info("AptAdapter getOutgoingStreams events", eventsAll[0]);
        const currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))
        const eventsSend = eventsAll.filter(event => event.data.sender! === sendAddress);
        if (eventsSend.length === 0) return [];
        // console.info("AptAdapter getOutgoingStreams eventsSend", eventsSend);

        const streamIds = eventsSend.map(event => event.data.id!);
        const resources = await this.client.getAccountResources(sendAddress);
        // console.info("AptAdapter getOutgoingStreams resources:", resources);
        const resGlConf = resources.find((r) => r.type.includes(aptosConfigType))!;
        // @ts-ignore
        const outStreamHandle = resGlConf.data.streams_store.inner.handle!;
        let streams: StreamInfo[] = [];
        for (const streamId of streamIds) {
            const tbReqStreamInd = {
                key_type: "u64",
                value_type: `${sendAddress}::${aptosStreamType}`,
                key: streamId,
            };
            // console.info("AptAdapter getIncomingStreams outStreamHandle, tbReqStreamInd", streamId, outStreamHandle, tbReqStreamInd);
            const stream = await this.client.getTableItem(outStreamHandle, tbReqStreamInd);
            console.log('stream', stream)
            const status = this.getStatus(stream, currTime)
            const withdrawableAmount = this.calculateWithdrawableAmount(
                Number(stream.start_time) * 1000,
                Number(stream.stop_time) * 1000,
                Number(currTime),
                Number(stream.pauseInfo.pause_at) * 1000,
                Number(stream.last_withdraw_time) * 1000,
                Number(stream.pauseInfo.acc_paused_time) * 1000,
                Number(stream.interval),
                Number(stream.rate_per_interval),
                status,
            )
            console.log('withdrawableAmount', withdrawableAmount)
            const streamedAmount = this.calculateStreamedAmount(
                Number(stream.withdrawn_amount),
                Number(stream.start_time) * 1000,
                Number(stream.stop_time) * 1000,
                Number(currTime),
                Number(stream.pauseInfo.pause_at) * 1000,
                Number(stream.last_withdraw_time) * 1000,
                Number(stream.pauseInfo.acc_paused_time) * 1000,
                Number(stream.interval),
                Number(stream.rate_per_interval),
                status,
            );
            streams.push({
                name: stream.name,
                status: status,
                createTime: (Number(stream.create_at) * 1000).toString(),
                depositAmount: this.displayAmount(new BigNumber(stream.deposit_amount)),
                streamId: stream.id,
                interval: stream.interval,
                lastWithdrawTime: stream.last_withdraw_time,
                ratePerInterval: stream.rate_per_interval,
                recipientId: stream.recipient,
                remainingAmount: this.displayAmount(new BigNumber(stream.remaining_amount)),
                senderId: stream.sender,
                startTime: (Number(stream.start_time) * 1000).toString(),
                stopTime: (Number(stream.stop_time) * 1000).toString(),
                withdrawnAmount: this.displayAmount(new BigNumber(stream.withdrawn_amount)),
                pauseInfo: {
                    accPausedTime: stream.pauseInfo.acc_paused_time,
                    pauseAt: (Number(stream.pauseInfo.pause_at) * 1000).toString(),
                    paused: stream.pauseInfo.paused,
                },
                streamedAmount: this.displayAmount(new BigNumber(streamedAmount)).toString(),
                withdrawableAmount: this.displayAmount(new BigNumber(withdrawableAmount)).toString(),
                escrowAddress: stream.escrow_address,
            });
        }
        console.info("AptAdapter getOutStreamHandle streams", streams);
        return streams;
    }


    async query(address: string, side: 'incoming' | 'outgoing'): Promise<StreamInfo[]> {
        if (side == 'incoming') {
            return this.getIncomingStreams(address);
        } else {
            return this.getOutgoingStreams(address);
        }
    }

    async create(
        name: string,
        remark: string,
        recipientAddr: string,
        depositAmount: number,
        startTime: string,
        stopTime: string,
        interval: number, 
        canPause?: boolean,
        closeable?: boolean,
        recipientModifiable?: boolean
    ) {
        const transaction: Types.TransactionPayload_EntryFunctionPayload = {
            type: 'entry_function_payload',
            function: `${this.contract}::stream::create`,
            arguments: [
                name,
                remark,
                recipientAddr,
                depositAmount * 10 ** 8,
                startTime,
                stopTime,
                Math.floor(interval / 1000).toString(),
                true,
                true,
                true,
            ],
            type_arguments: ['0x1::aptos_coin::AptosCoin'],
        };
        console.log('transaction', transaction)

    }

    async extend(
        coin_id: string,
        stop_time: string,
        stream_id: string,
      ) {
      const transaction: Types.TransactionPayload_EntryFunctionPayload = {
          type: "entry_function_payload",
          function: `${this.contract}::streampay::extend`,
          arguments: [stop_time, coin_id, stream_id],
          type_arguments: ['0x1::aptos_coin::AptosCoin'],
      };
    }

    async close(stream_id: string) {
        const transaction: any = {
            type: "entry_function_payload",
            function: `${this.contract}::streampay::close`,
            arguments: [stream_id],
            type_arguments: ['0x1::aptos_coin::AptosCoin'],
        };
        
        const bcsTxn = await AptosClient.generateBCSTransaction(this.account, transaction );

        await this.client.submitSignedBCSTransaction(bcsTxn);

    }

    async pause(stream_id: string) {
        const transaction: any = {
            type: "entry_function_payload",
            function: `${this.contract}::streampay::pause`,
            arguments: [stream_id],
            type_arguments: ['0x1::aptos_coin::AptosCoin'],
        };
        
        const bcsTxn = await AptosClient.generateBCSTransaction(this.account, transaction );

        await this.client.submitSignedBCSTransaction(bcsTxn);
    }

    async resume(stream_id: string) {
        const transaction: any = {
            type: "entry_function_payload",
            function: `${this.contract}::streampay::resume`,
            arguments: [stream_id],
            type_arguments: ['0x1::aptos_coin::AptosCoin'],
        };
        
        const bcsTxn = await AptosClient.generateBCSTransaction(this.account, transaction );
        await this.client.submitSignedBCSTransaction(bcsTxn);
    }

    async withdraw(coin_id: string, stream_id: string) {

        const transaction = {
            type: "entry_function_payload",
            function: `${this.contract}::streampay::withdraw`,
            arguments: [coin_id, stream_id],
            type_arguments: ['0x1::aptos_coin::AptosCoin'],
        } as any;

        const bcsTxn = await AptosClient.generateBCSTransaction(this.account, transaction );

        await this.client.submitSignedBCSTransaction(bcsTxn);
    }

    sendTransaction(from: string, to: string, amount: number): string {
        return "hash";
    }

    getTransactionStatus(hash: string): string {
        return "Success";
    }

    getStatus(stream: any, currTime: bigint): StreamStatus {
        if (Boolean(stream.closed)) {
            return StreamStatus.Canceled
        }
        if (Boolean(stream.pauseInfo.paused)) {
            return StreamStatus.Paused
        }
        if (currTime < BigInt(stream.start_time) * BigInt(1000)) {
            return StreamStatus.Scheduled
        }
        if (currTime < BigInt(stream.stop_time) * BigInt(1000)) {
            return StreamStatus.Streaming
        }
        return StreamStatus.Unknown;
    }

    displayAmount(amount: BigNumber): string {
        return amount.dividedBy(10 ** 8).toFixed(6).toString();
    }

    calculateWithdrawableAmount(
        startTime: number,
        stopTime: number,
        currTime: number,
        pausedAt: number,
        lastWithdrawTime: number,
        accPausedTime: number,
        interval: number,
        ratePerInterval: number,
        status: StreamStatus,
    ): number {
        let withdrawal = 0;
        let timeSpan = BigInt(0)
        if (currTime <= BigInt(startTime)) {
            return withdrawal
        }
        // console.log('currTime', currTime)
        // console.log('stopTime', stopTime)
        if (currTime > BigInt(stopTime)) {
            if (status === StreamStatus.Paused) {
                timeSpan = BigInt(pausedAt) - BigInt(lastWithdrawTime) - BigInt(accPausedTime);
            } else {
                timeSpan = BigInt(stopTime) - BigInt(lastWithdrawTime) - BigInt(accPausedTime);
            }
        } else {
            if (status === StreamStatus.Paused) {
                timeSpan = BigInt(pausedAt) - BigInt(lastWithdrawTime) - BigInt(accPausedTime)
            } else {
                timeSpan = BigInt(currTime) - BigInt(lastWithdrawTime) - BigInt(accPausedTime);
            }
        }

        let intervalNum = Math.ceil(Number(timeSpan / BigInt(interval) / BigInt(1000)));
        withdrawal = Number(BigInt(intervalNum) * BigInt(ratePerInterval) / BigInt(1000));
        return withdrawal;
    }

    calculateStreamedAmount(
        withdrawnAmount: number,
        startTime: number,
        stopTime: number,
        currTime: number,
        pausedAt: number,
        lastWithdrawTime: number,
        accPausedTime: number,
        interval: number,
        ratePerInterval: number,
        status: StreamStatus,
    ): number {
        let withdrawable = this.calculateWithdrawableAmount(
            startTime,
            stopTime,
            currTime,
            pausedAt,
            lastWithdrawTime,
            accPausedTime,
            interval,
            ratePerInterval,
            status
        )
        return withdrawnAmount + withdrawable;
    }
}


export function createNetworkAdapter(
    blockchain: string, account: AptosAccount, wallet: Wallet): NetworkAdapter {
    switch (blockchain) {
        case "aptos":
            return new AptAdapter(CONFIGS.aptos_testnet, account, wallet);
        default:
            throw new Error("Invalid blockchain name");
    }
}