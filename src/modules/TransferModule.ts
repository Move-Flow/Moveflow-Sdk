import { SDK } from '../sdk'
import { IModule } from '../interfaces/IModule'
import {
  Payload,
} from '../types/aptos'

import {
  composeType,
} from '../utils/contract'

export type batchTransferPayload = {
  
  recipientAddrs: string[],
  depositAmounts: number[],
  coinType?: string
}

const AptosCoin = '0x1::aptos_coin::AptosCoin'

export class TransferModule implements IModule {
  protected _sdk: SDK

  get sdk() {
    return this._sdk
  }

  constructor(sdk: SDK) {
    this._sdk = sdk
  }

  batchCreate(input: batchTransferPayload): Payload {

    const {
      recipientAddrs,
      depositAmounts,
      coinType
    } = input

    const { modules } = this.sdk.networkOptions
    const functionName = composeType(modules.StreamModule, 'batchTransferV2')

    const typeArguments = [coinType ?? AptosCoin]

    let newDepositAmounts = depositAmounts.map(value=>(value * 10 ** 8).toString());

    const args = [
      recipientAddrs,
      newDepositAmounts,
    ]

    return {
      type: 'entry_function_payload',
      function: functionName,
      type_arguments: typeArguments,
      arguments: args,
    }

  }

}

