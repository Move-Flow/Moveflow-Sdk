import { SDK } from '../sdk'
import { IModule } from '../interfaces/IModule'
import {
  AptosEvent,
  AptosResourceType,
  Payload,
} from '../types/aptos'

// import { BigNumber } from '../types/common'
import BigNumber from 'bignumber.js';
import StreamInfo from '../types/streamInfo'
import {StreamStatus} from "../types/streamStatus";

import {
  composeType,
} from '../utils/contract'
import Decimal from 'decimal.js'

export type createParams = {
  coinX: AptosResourceType
  coinY: AptosResourceType
  amount: BigNumber
  fixedCoin: 'X' | 'Y'
}

export type createReturn = {
  amount: Decimal
  coinXDivCoinY: Decimal
  coinYDivCoinX: Decimal
  shareOfPool: Decimal
}

export type createPayload = {
  
  recipientAddr: string,
  depositAmount: number,
  startTime: string,
  stopTime: string,
  
  name?: string,
  remark?: string,

  interval?: number,
  coinType?: string,
  canPause?: boolean,
  closeable?: boolean,
  recipientModifiable?: boolean
}

export type batchCreatePayload = {
  
  recipientAddrs: string[],
  depositAmounts: number[],
  startTime: string,
  stopTime: string,
  
  name?: string,
  remark?: string,

  interval?: number,
  coinType?: string,
  canPause?: boolean,
  closeable?: boolean,
  recipientModifiable?: boolean
}

export type withdrawPayload = {
  id: string | number,
  coinType?: string
}

export type pausePayload = {
  id: string | number,
  coinType?: string
}

export type closePayload = {
  id: string | number,
  coinType?: string
}

export type extendPayload = {
  id: string | number,          // streamId
  extraAmount: number ,         // 额外的金额
  stopTime: string,             // 延长后的结束时间
  coinType?: string             // 币种
  ratePerInterval: string,      // 每个间隔的金额
  interval: string,             // 间隔
}

export type CoinPair = {
  coinX: AptosResourceType
  coinY: AptosResourceType
}

const AptosCoin = '0x1::aptos_coin::AptosCoin'

export class StreamModule implements IModule {
  protected _sdk: SDK

  get sdk() {
    return this._sdk
  }

  constructor(sdk: SDK) {
    this._sdk = sdk
  }

  async query(): Promise<any> {

    const { modules } = this.sdk.networkOptions

    return {
      address: modules.StreamModule
    }
  }

  create(input: createPayload): Payload {

    const {
      name,
      remark,
      recipientAddr,
      depositAmount,
      startTime,
      stopTime,
      interval,
      coinType,
      canPause,
      closeable,
      recipientModifiable
    } = input

    const { modules } = this.sdk.networkOptions
    const functionName = composeType(modules.StreamModule, 'create')

    const typeArguments = [coinType ?? AptosCoin]

    const args = [
      name || '',
      remark || '',
      
      recipientAddr,
      (depositAmount * 10 ** 8).toString(),
      startTime.toString(),
      stopTime.toString(),

      Math.floor((interval ?? 0) / 1000).toString(),
      (canPause ?? true).toString(),
      (closeable ?? true).toString(),
      (recipientModifiable ?? true).toString(),
    ]

    return {
      type: 'entry_function_payload',
      function: functionName,
      type_arguments: typeArguments,
      arguments: args,
    }

  }

  batchCreate(input: batchCreatePayload): Payload {
    const {
      name,
      remark,
      recipientAddrs,
      depositAmounts,
      startTime,
      stopTime,
      interval,
      coinType,
      canPause,
      closeable,
      recipientModifiable
    } = input

    const { modules } = this.sdk.networkOptions
    const functionName = composeType(modules.StreamModule, 'batchCreateV3')

    const typeArguments = [coinType ?? AptosCoin]

    let newDepositAmounts = depositAmounts.map(value=>(value * 10 ** 8).toString());

    const args = [
      name || '',
      remark || '',
      
      recipientAddrs,
      newDepositAmounts,
      startTime.toString(),
      stopTime.toString(),

      Math.floor((interval ?? 0) / 1000).toString(),
      (canPause ?? true).toString(),
      (closeable ?? true).toString(),
      (recipientModifiable ?? true).toString(),
    ]

    return {
      type: 'entry_function_payload',
      function: functionName,
      type_arguments: typeArguments,
      arguments: args,
    }

  }

  pause(input: pausePayload): Payload {
    const {
      id,
      coinType,
    } = input

    const { modules } = this.sdk.networkOptions
    const functionName = composeType(modules.StreamModule, 'pause')
    const args = [id.toString()]
    const typeArguments = [coinType ?? AptosCoin]

    return {
      type: 'entry_function_payload',
      function: functionName,
      type_arguments: typeArguments,
      arguments: args,
    }
  }
  
  resume(input: pausePayload): Payload {
    const {
      id,
    } = input

    const { modules } = this.sdk.networkOptions
    const functionName = composeType(modules.StreamModule, 'resume')
    const args = [id.toString()]

    return {
      type: 'entry_function_payload',
      function: functionName,
      type_arguments: [],
      arguments: args,
    }
  }

  close(input: closePayload): Payload {
    const {
      id,
      coinType,
    } = input

    const { modules } = this.sdk.networkOptions
    const functionName = composeType(modules.StreamModule, 'close')
    const args = [id.toString()]

    const typeArguments = [coinType ?? AptosCoin]

    return {
      type: 'entry_function_payload',
      function: functionName,
      type_arguments: typeArguments,
      arguments: args,
    }
  }

  withdraw(input: withdrawPayload): Payload {
    const {
      id,
      coinType,
    } = input

    const { modules } = this.sdk.networkOptions
    const functionName = composeType(modules.StreamModule, 'withdraw')
    const args = [id.toString()]
    const typeArguments = [coinType ?? AptosCoin]

    return {
      type: 'entry_function_payload',
      function: functionName,
      type_arguments: typeArguments,
      arguments: args,
    }
  }

  extend(input: extendPayload): Payload {

    const {
      id,
      extraAmount,
      stopTime,
      ratePerInterval,
      interval,
      coinType,
    } = input

    // const { modules } = this.sdk.networkOptions
    // const functionName = composeType(modules.StreamModule, 'extend')

    const newStopTime = Math.ceil((Number(stopTime) + extraAmount / ((Number(ratePerInterval) / 1000) / Number(interval))) / 1000);

    const args = [
      newStopTime.toString(),
      id.toString(),
    ]

    const typeArguments = [coinType ?? AptosCoin]

    return {
      type: 'entry_function_payload',
      function: '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207::stream::extend',
      type_arguments: typeArguments,
      arguments: args,
    }
  }

  async getStreamById(streamId: string): Promise<StreamInfo> {

    const currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))

    const address = this.sdk.networkOptions.modules.DeployerAddress;
    const aptosConfigType = 'stream::GlobalConfig';
    const aptosStreamType = 'stream::StreamInfo';

    const resources = await this._sdk.client.getAccountResources(address);
    const resGlConf = resources.find((r) => r.type.includes(aptosConfigType))!;
    // @ts-ignore
    const inStreamHandle = resGlConf.data.streams_store.inner.handle!;
  
    const tbReqStreamInd = {
      key_type: "u64",
      value_type: `${address}::${aptosStreamType}`,
      key: streamId,
    };
    // console.debug("AptAdapter getIncomingStreams inStreamHandle, tbReqStreamInd", streamId, inStreamHandle, tbReqStreamInd);
    const stream = await this._sdk.client.getTableItem(inStreamHandle, tbReqStreamInd);

    const status = this.getStatus(stream, currTime);

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
    );
    
    const streamedAmount = this.calculateStreamedAmount(
      Number(this.displayAmount(new BigNumber(stream.withdrawn_amount))),
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

    let streamInfo = {
      name: stream.name,
      status: status,
      createTime: (Number(stream.create_at) * 1000).toString(),
      depositAmount: this.displayAmount(new BigNumber(stream.deposit_amount)),
      streamId: stream.id,
      interval: stream.interval,
      lastWithdrawTime: (Number(stream.last_withdraw_time) * 1000).toString(),
      ratePerInterval: stream.rate_per_interval,
      recipientId: stream.recipient,
      remainingAmount: this.displayAmount(new BigNumber(stream.remaining_amount)),
      senderId: stream.sender,
      startTime: (Number(stream.start_time) * 1000).toString(),
      stopTime: (Number(stream.stop_time) * 1000).toString(),
      withdrawnAmount: this.displayAmount(new BigNumber(stream.withdrawn_amount)),
      pauseInfo: {
        accPausedTime: (Number(stream.pauseInfo.acc_paused_time)).toString(),
        pauseAt: (Number(stream.pauseInfo.pause_at) * 1000).toString(),
        paused: stream.pauseInfo.paused,
      },
      streamedAmount: streamedAmount.toString(),
      withdrawableAmount: this.displayAmount(new BigNumber(withdrawableAmount)).toString(),
      escrowAddress: stream.escrow_address,
    };

    return streamInfo;
  }

  async withdrawable(streamId: string): Promise<number> {

    const currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))

    const address = this.sdk.networkOptions.modules.DeployerAddress;
    const aptosConfigType = 'stream::GlobalConfig';
    const aptosStreamType = 'stream::StreamInfo';
    
    const resources = await this._sdk.client.getAccountResources(address);
    const resGlConf = resources.find((r) => r.type.includes(aptosConfigType))!;
    // @ts-ignore
    const inStreamHandle = resGlConf.data.streams_store.inner.handle!;
  
    const tbReqStreamInd = {
      key_type: "u64",
      value_type: `${address}::${aptosStreamType}`,
      key: streamId,
    };
    // console.debug("AptAdapter getIncomingStreams inStreamHandle, tbReqStreamInd", streamId, inStreamHandle, tbReqStreamInd);
    const stream = await this._sdk.client.getTableItem(inStreamHandle, tbReqStreamInd);

    const status = this.getStatus(stream, currTime);

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
    );

    return withdrawableAmount;
  }
  
  async getIncomingStreams(recvAddress: string): Promise<StreamInfo[]> {
    
    const address = this.sdk.networkOptions.modules.DeployerAddress
    const aptosConfigType = 'stream::GlobalConfig'
    const aptosStreamType = 'stream::StreamInfo'
    

    const currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))
    console.log('recevAddr', recvAddress);
    const event_handle = `${address}::${aptosConfigType}`;
    const eventField = "stream_events";
    const eventsAll = await this._sdk.client.getEventsByEventHandle(
      address,
      event_handle,
      eventField,
      {
        start: 0,
        limit: 1000,
      }
    );
    // console.debug("AptAdapter getIncomingStreams events", eventsAll);

    const eventsRecv = eventsAll.filter(event => event.data.recipient! === recvAddress);
    if (eventsRecv.length === 0) return [];

    const streamIds = Array.from(new Set(eventsRecv.map(event => event.data.id!)));
    // console.debug("AptAdapter getIncomingStreams streamIds", streamIds);

    const resources = await this._sdk.client.getAccountResources(address);
    // console.debug("AptAdapter getIncomingStreams resources:", resources);
    const resGlConf = resources.find((r) => r.type.includes(aptosConfigType))!;
    // @ts-ignore
    const inStreamHandle = resGlConf.data.streams_store.inner.handle!;
    let streams: StreamInfo[] = [];
    for ( const streamId of streamIds ) {
      const tbReqStreamInd = {
        key_type: "u64",
        value_type: `${address}::${aptosStreamType}`,
        key: streamId,
      };
      // console.debug("AptAdapter getIncomingStreams inStreamHandle, tbReqStreamInd", streamId, inStreamHandle, tbReqStreamInd);
      const stream = await this._sdk.client.getTableItem(inStreamHandle, tbReqStreamInd);
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
        Number(this.displayAmount(new BigNumber(stream.withdrawn_amount))),
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
        lastWithdrawTime: (Number(stream.last_withdraw_time) * 1000).toString(),
        ratePerInterval: stream.rate_per_interval,
        recipientId: stream.recipient,
        remainingAmount: this.displayAmount(new BigNumber(stream.remaining_amount)),
        senderId: stream.sender,
        startTime: (Number(stream.start_time) * 1000).toString(),
        stopTime: (Number(stream.stop_time) * 1000).toString(),
        withdrawnAmount: this.displayAmount(new BigNumber(stream.withdrawn_amount)),
        pauseInfo: {
          accPausedTime: (Number(stream.pauseInfo.acc_paused_time)).toString(),
          pauseAt: (Number(stream.pauseInfo.pause_at) * 1000).toString(),
          paused: stream.pauseInfo.paused,
        },
        streamedAmount: streamedAmount.toString(),
        withdrawableAmount: this.displayAmount(new BigNumber(withdrawableAmount)).toString(),
        escrowAddress: stream.escrow_address,
      });
      // console.log('stream___', stream);
    }
    console.debug("AptAdapter getIncomingStreams streams", streams);
    return streams;
  }

  async getOutgoingStreams(sendAddress: string): Promise<StreamInfo[]> {

    const address = this.sdk.networkOptions.modules.DeployerAddress
    const aptosConfigType = 'stream::GlobalConfig'
    const aptosStreamType = 'stream::StreamInfo'

    const event_handle = `${address}::${aptosConfigType}`;
    const eventField = "stream_events";
    const eventsAll = await this.sdk.resources.getEventsByEventHandle(
      address,
      event_handle,
      eventField,
      {
        start: BigInt(0),
        limit: 1000,
      }
    );
    console.info("AptAdapter getOutgoingStreams events", eventsAll);
    const currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))
    const eventsSend = eventsAll.filter(event => event.data.sender! === sendAddress);
    if (eventsSend.length === 0) return [];
    // console.info("AptAdapter getOutgoingStreams eventsSend", eventsSend);

    const streamIds = Array.from(new Set(eventsSend.map(event => event.data.id!)));
    console.log('streamId,', streamIds);
    const resources = await this._sdk.client.getAccountResources(address);

    console.info("AptAdapter getOutgoingStreams resources:", resources);
    const resGlConf = resources.find((r) => r.type.includes(aptosConfigType))!;
    // @ts-ignore
    const outStreamHandle = resGlConf.data.streams_store.inner.handle!;
    let streams: StreamInfo[] = [];
    for ( const streamId of streamIds ) {
      const tbReqStreamInd = {
        key_type: "u64",
        value_type: `${address}::${aptosStreamType}`,
        key: streamId,
      };
      // console.info("AptAdapter getIncomingStreams outStreamHandle, tbReqStreamInd", streamId, outStreamHandle, tbReqStreamInd);
      const stream = await this._sdk.client.getTableItem(outStreamHandle, tbReqStreamInd);
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
      // console.log('withdrawableAmount', withdrawableAmount)
      const streamedAmount = this.calculateStreamedAmount(
        Number(this.displayAmount(new BigNumber(stream.withdrawn_amount))),
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
        lastWithdrawTime: (Number(stream.last_withdraw_time) * 1000).toString(),
        ratePerInterval: stream.rate_per_interval,
        recipientId: stream.recipient,
        remainingAmount: this.displayAmount(new BigNumber(stream.remaining_amount)),
        senderId: stream.sender,
        startTime: (Number(stream.start_time) * 1000).toString(),
        stopTime: (Number(stream.stop_time) * 1000).toString(),
        withdrawnAmount: this.displayAmount(new BigNumber(stream.withdrawn_amount)),
        pauseInfo: {
          accPausedTime: (Number(stream.pauseInfo.acc_paused_time) * 1000).toString(),
          pauseAt: (Number(stream.pauseInfo.pause_at) * 1000).toString(),
          paused: stream.pauseInfo.paused,
        },
        streamedAmount: streamedAmount.toString(),
        withdrawableAmount: this.displayAmount(new BigNumber(withdrawableAmount)).toString(),
        escrowAddress: stream.escrow_address,
      });
    }
    console.info("AptAdapter getOutStreamHandle streams", streams);
    return streams;

  }

  async getEvents(params: any): Promise<AptosEvent[]> {
    const { modules } = this.sdk.networkOptions
    const eventHandleStruct = '' 

    const events = await this.sdk.resources.getEventsByEventHandle(modules.ResourceAccountAddress, eventHandleStruct, params.fieldName, params.query)
    return events
  
  }

  getStatus(stream: any, currTime: bigint): StreamStatus {
    if (Boolean(stream.closed)) {
      return StreamStatus.Canceled;
    }
    if (Boolean(stream.pauseInfo.paused)) {
      return StreamStatus.Paused;
    }
    if (currTime < BigInt(stream.start_time) * BigInt(1000)) {
      return StreamStatus.Scheduled;
    }
    if (currTime < BigInt(stream.stop_time) * BigInt(1000)) {
      return StreamStatus.Streaming;
    }
    if (currTime > BigInt(stream.stop_time) * BigInt(1000)) {
      return StreamStatus.Completed;
    }
    return StreamStatus.Unknown;
  }

  displayAmount(amount: BigNumber): string {
    return amount.dividedBy(10 ** 8).toFixed(6).toString();
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
    return withdrawnAmount + Number(this.displayAmount(new BigNumber(Number(withdrawable))));
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





}

