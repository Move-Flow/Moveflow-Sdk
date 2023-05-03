import { SUI_CLOCK_OBJECT_ID, RawSigner, TransactionBlock } from "@mysten/sui.js";

import { IModule } from '../interfaces/IModule'
import { SDK } from '../sdk';
import { SUI_COIN_TYPE } from '../constants'


export class AptosStreamModule implements IModule {

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
  async query(owner: string, side: "outgoing" | 'incoming') {

    return []
  } 

}