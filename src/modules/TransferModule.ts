import { SDK } from '../sdk'
import { IModule } from '../interfaces/IModule'
import { Payload } from '../types/aptos'
import { composeType } from '../utils/contract'
import { Types } from 'aptos'

export type batchTransferPayload = {
  recipientAddrs: string[],
  depositAmounts: number[],
  isFeeFromSender?: boolean,
  coinType?: string,
  isIngoreUnregisterRecipient?: boolean,
}

export type CheckPayload = {
  recipient: string,
  passed: boolean,
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

  async checkRegister(recipientAddrs: string[]): Promise<CheckPayload[]> {
    
    const check = async (recipient: string, coin_type?: string) => {
      
      const _function = '0x1::coin::is_account_registered'
      const _coin_type = coin_type || AptosCoin

      const payload: Types.ViewRequest = {
          function: _function,
          type_arguments: [_coin_type],
          arguments: [recipient],
      };
      const result = await this.sdk.provider.view(payload);
      return Boolean(result[0] as any);
    }

    let list: CheckPayload[] = [];
    for(let i = 0; i < recipientAddrs.length; i++) {
      let passed = await check(recipientAddrs[i]);
      list.push({
        recipient: recipientAddrs[i],
        passed: passed
      })
    }
    return list    
  }

  batchTransfer(input: batchTransferPayload): Payload {

    const { recipientAddrs, depositAmounts, isFeeFromSender, coinType, isIngoreUnregisterRecipient } = input

    const { modules } = this.sdk.networkOptions

    const functionName = composeType(modules.TransferModule, 'batchTransferV5')

    const typeArguments = [coinType ?? AptosCoin]

    let newDepositAmounts = depositAmounts.map(value => (value * 10 ** 8).toString());

    const args = [
      recipientAddrs,
      newDepositAmounts,
      (isFeeFromSender ?? true).toString(),
      (isIngoreUnregisterRecipient ?? true).toString(),
    ]
    return {
      type: 'entry_function_payload',
      function: functionName,
      type_arguments: typeArguments,
      arguments: args,
    }
  } 
  
}

