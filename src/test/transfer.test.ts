import SDK from '../main'
import { signAndSubmitTx, waitForTx, balanceOf } from '../utils'
import { AptosAccount, Network } from "aptos";
 
const mock_account = () => {
    let mnemonic = ''
    const alice = AptosAccount.fromDerivePath("m/44'/637'/0'/0'/0'", mnemonic);
    const addr = AptosAccount.fromDerivePath("m/44'/637'/1'/0'/0'", mnemonic);
    const addr1 = AptosAccount.fromDerivePath("m/44'/637'/1'/0'/0'", mnemonic);
    const addr2 = AptosAccount.fromDerivePath("m/44'/637'/1'/0'/0'", mnemonic);
    const addr3 = AptosAccount.fromDerivePath("m/44'/637'/1'/0'/0'", mnemonic);
    return [alice, addr, addr1, addr2, addr3]
}


const list = mock_account().map(item => {
    return {
        recipient: item.address().hex(),
        amount: 1
    }
})

// { recipient: "0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180", amount: 0.5 },
// { recipient: "0x21e1b39cc598cc1c9f858585e303d36bc8b5451b580b83c4686be8fbe19", amount: 0.5 },

describe('Transfer Module', () => {

    beforeAll(async () => {
        const [alice, bob] = mock_account()

        console.log('alice:', alice.address().hex())
        console.log('bob:', bob.address().hex())
    })
    beforeEach(async () => {
    })
    afterAll(async () => {
    })
    afterEach(async () => {
    })

    const { batchcall } = new SDK(Network.TESTNET)

    it('batchTransfer', async () => {

        const output = batchcall.batchTransfer({
            recipientAddrs: list.map(item => item.recipient),
            depositAmounts: list.map(item => item.amount),
        });
        expect(output).toBeDefined()
    })

    it('checkRegister', async () => {
        let recipients = list.map(item => item.recipient)
        let checked = await batchcall.checkRegister(recipients)
        let passed = checked.filter(item => item.passed)
        console.log('checked:', checked)
        console.log('check passed length:', passed.length)
        console.log('checked total length:', checked.length)

        expect(checked.length).toBe(recipients.length)
    })

    it('batchTransfer sign and submit tx', async () => {

        const payload = batchcall.batchTransfer({
            recipientAddrs: list.map(item => item.recipient),
            depositAmounts: list.map(item => item.amount),
        });

        const [alice] = mock_account()

        let balance = await balanceOf()
        console.log('pre transfer balance:', balance.toString())
        
        const txnHash = await signAndSubmitTx(alice, payload)

        await waitForTx(txnHash);

        console.log('pendingTxHash:', txnHash)

        balance = await balanceOf()
        console.log('has transfered balance:', balance.toString())
    })
})
