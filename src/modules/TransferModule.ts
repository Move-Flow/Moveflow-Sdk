import { SDK } from '../sdk'
import { IModule } from '../interfaces/IModule'
import { Payload } from '../types/aptos'
import { composeType } from '../utils/contract'
// import { AptosClient } from "aptos";

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

    const check = async (recipient: string, coin_type="0x1::aptos_coin::AptosCoin") => {
      const req = await fetch('https://fullnode.testnet.aptoslabs.com/v1/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          "function": "0x1::coin::is_account_registered",
          "type_arguments": [coin_type],
          "arguments": [recipient]
        })
      });
      let res = await req.json();
      return res[0];
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

    const functionName = composeType(modules.TransferModule, 'batchTransferV4')

    const typeArguments = [coinType ?? AptosCoin]

    let newDepositAmounts = depositAmounts.map(value => (value * 10 ** 8).toString());

    const args = [
      recipientAddrs,
      newDepositAmounts,
      (isFeeFromSender ?? true).toString(),
      (isIngoreUnregisterRecipient ?? false).toString(),
    ]
    return {
      type: 'entry_function_payload',
      function: functionName,
      type_arguments: typeArguments,
      arguments: args,
    }
  }
}

