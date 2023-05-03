import { SUI_CLOCK_OBJECT_ID, RawSigner, TransactionBlock } from "@mysten/sui.js";

import { IModule } from '../interfaces/IModule'
import { SDK } from '../sdk';

import { SUI_COIN_TYPE } from '../constants'



// const sui_coin = SUI_COIN_TYPE

type StreamInfo = {
  coin_id: string,
  stream_id: string,
  sender: string,
  recipient: string,
  rate_per_second: string,
  start_time: string,
  stop_time: string,
  last_withdraw_time: string,
  deposit_amount: string,
  remaining_balance: string,
  // transferred: string, // 已传输金额
  withdrawal: string | null, // 收款方 当前可以 接收的金额
  to_transfer: string, // 未传输金额
}

export class SuiStreamModule implements IModule {

  protected _sdk: SDK;
 
  constructor(sdk: SDK) {
    this._sdk = sdk;
  }

  get sdk() {
    return this._sdk;
  }
  
  // the general user operates the following functions 
  async create (
    signer: RawSigner, 
    recipient: string, 
    deposit_amount: number, 
    start_time: number, 
    stop_time: number, 
    coin_type: string = SUI_COIN_TYPE, 
    interval: number = 1000, 
    is_paused: boolean = false
) {
    
    const global_config: string = this._sdk.networkOptions.globalConfigObjectId
    const package_objectId: string = this._sdk.networkOptions.packageObjectId
 
    const tx = new TransactionBlock();
    const coins = tx.splitCoins(tx.gas, [tx.pure(deposit_amount)])
    tx.moveCall({
      target: `${package_objectId}::stream::create`,
      typeArguments: [coin_type],
      arguments: [
        tx.object(global_config),
        coins[0],
        tx.pure(recipient),
        tx.pure(deposit_amount),
        tx.pure(start_time),
        tx.pure(stop_time),
        tx.pure(interval),
        tx.pure(is_paused),
        tx.object(SUI_CLOCK_OBJECT_ID)
      ],
    });

    tx.setGasBudget(100000000);
    try {
      const res = await signer.signAndExecuteTransactionBlock({transactionBlock: tx});
      console.log('create stream result', res)
    } catch (e) {
      console.log('e1rror', e)
    }
  }

  async extend(signer: RawSigner, stop_time: number, stream_id: string, coin_type: string) {
    const tx = new TransactionBlock()

    // Split a coin object off of the gas object:
    const coins = tx.splitCoins(tx.gas, [tx.pure(1000000)]);

    const global_config: string = this._sdk.networkOptions.globalConfigObjectId
    const package_objectId: string = this._sdk.networkOptions.packageObjectId
 

    tx.moveCall({
        target: `${package_objectId}::stream::extend`,
        typeArguments: [coin_type],
        arguments: [
            tx.object(stream_id),                                                             // stream id
            tx.object(global_config),                                                         // global config
            coins[0],
            tx.pure(stop_time)
        ]
    })
    tx.setGasBudget(10000000);

    try {
      const res = await signer.signAndExecuteTransactionBlock({transactionBlock: tx});
      console.log('create stream result', res)
    } catch (e) {
      console.log('e1rror', e)
    }


  }

  async close(streamId: string) {
    
  }

  async withdraw(streamId: string) {

  }

  async pause(sender: string, streamId: string) {

  }

  async resume(sender: string, streamId: string) {

  }

  // the admin of the contract operates the following functions   

  async initialize(owner: string, fee_recipient: string, admin: string) {

  }

  async register_coin(coin_type: string, admin: string) {

  }

  async set_fee_point(sender: string, streamId: string, feePointer: string) {

  }
 
  async set_new_admin(owner: string, new_admin: string) {

  }

  async set_new_recipient(owner: string, new_fee_recipient: string) {

  }

  // query method 
  async query(address: string, side: "outgoing" | 'incoming') {

    const provider = this._sdk.jsonRpcProvider;
    const incomingStreamObjectId: string = this._sdk.networkOptions.incomingStreamObjectId
    const outgoingStreamObjectId: string = this._sdk.networkOptions.outgoingStreamObjectId
    
    const incomingStreamRawInfo = await provider.getDynamicFieldObject({
      parentId: incomingStreamObjectId,
      name: { type: "address", value: address }
    })
    const tableObject = await provider.getObject({
      id: incomingStreamRawInfo.data?.objectId || "",
      options: { showContent: true }
    })
    const content = tableObject.data?.content as {
      type: string;
      fields: Record<string, any>;
      hasPublicTransfer: boolean;
      dataType: "moveObject";
    }
    const streamInfoRawList = await provider.multiGetObjects({
      ids: content.fields.value,
      options: { showContent:true, showOwner:true },
    })
    let streamInfoList: StreamInfo[] = []
    for (let i = 0; i < streamInfoRawList.length; i++) {
      let content = streamInfoRawList[i].data?.content  as {
        type: string;
        fields: Record<string, any>;
        hasPublicTransfer: boolean;
        dataType: "moveObject";
      }
      
      if (content.fields.recipient != address) {
        continue
      }

      const startTime = content.fields.start_time
      
      streamInfoList.push({

        coin_id: "0x01",
        stream_id: content.fields.id.id,
        sender: content.fields.sender,
        recipient: content.fields.recipient,
        rate_per_second: content.fields.rate_per_interval,
        start_time: startTime,
        stop_time: content.fields.stop_time,
        last_withdraw_time: content.fields.last_withdraw_time,
        deposit_amount: content.fields.deposit_amount,
        remaining_balance:  content.fields.remaining_amount,
        to_transfer: "0",
        withdrawal: "0",
      })
    }
    return streamInfoList
  }
}