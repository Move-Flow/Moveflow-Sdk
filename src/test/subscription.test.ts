import SDK from '../main'
import { CancelPayload, CreatePayload, DepositPayload, WithdrawPayload } from '../modules/SubscriptionModule';
import { AptosAccount, Network } from "aptos";

import {
    // signAndSubmitTx, waitForTx, 
    // delay 
} from '../utils'

let mnemonic = 'remain exercise lecture shuffle length dial vapor steel gather away better exit'
const alice = AptosAccount.fromDerivePath("m/44'/637'/0'/0'/0'", mnemonic);

describe('Subscription Module', () => {

    const { subscription } = new SDK(Network.TESTNET)

    it('create', async () => {

        const _input: CreatePayload = {
            recipient: alice.address.toString(),
            deposit_amount: 1,
            start_time: Math.floor(Date.now() / 1000 ).toString(),
            stop_time: Math.floor(Date.now() / 1000  + 60 * 60 * 24 * 30).toString(),
            rate_type: 'day',
            amount_type: 'fixed'
        }

        const output = subscription.create(_input);

        expect(output).toBeDefined()

    })

    it('deposit', async () => {

        const _input: DepositPayload = {
            deposit_amount: 1,
            subscription_id: 22
        }

        const output = subscription.deposit(_input);

        expect(output).toBeDefined()
    })
    
    it('cancel', async () => {

        const _input: CancelPayload = {
            subscription_id: 22
        }

        const output = subscription.cancel(_input);

        expect(output).toBeDefined() 
    })

    it('withdraw', async () => {
        const _input: WithdrawPayload = {
            subscription_id: 22,
            withdraw_amount: 1
        }
        const output = subscription.withdraw(_input);
        expect(output).toBeDefined() 
    })

    it('create sign and submit tx', async () => {
    })

    it('get subscription list by recipient ', async () => {

        const recipient = '0x49958931304d1f946374d8b1f7c0ced6ee6b18110361b0604d0f55a0345b3a74'
        const output = await subscription.getSubscriptionsByRecipient(recipient);

        // await delay(3000)

        expect(output).toBeDefined()

    })

    it('get subscription list by sender ', async () => {

        const sender = '0x49958931304d1f946374d8b1f7c0ced6ee6b18110361b0604d0f55a0345b3a74'
        const output = await subscription.getSubscriptionsBySender(sender);

        expect(output).toBeDefined()

    })
})
