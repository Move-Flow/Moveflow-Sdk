import SDK from '../main'
import { signAndSubmitTx, waitForTx, balanceOf, delay } from '../utils'
import { AptosAccount, Network } from "aptos";

let mnemonic = 'remain exercise lecture shuffle length dial vapor steel gather away better exit'
const alice = AptosAccount.fromDerivePath("m/44'/637'/0'/0'/0'", mnemonic);

const mock_account = (): string[] => {

    // const addr = AptosAccount.fromDerivePath("m/44'/637'/1'/0'/0'", mnemonic);
    // const addr1 = AptosAccount.fromDerivePath("m/44'/637'/2'/0'/0'", mnemonic);
    // const addr2 = AptosAccount.fromDerivePath("m/44'/637'/3'/0'/0'", mnemonic);
    // const addr3 = AptosAccount.fromDerivePath("m/44'/637'/4'/0'/0'", mnemonic);
    return [
        "0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180", 
        "0x3a38a2b5fb1125077bc9e3cec2095b39a48075bebf6d387ec0c36569f34f174a", 
        '0x21e1b39cc598cc1c9f858585e303d36bc8b5451b580b83c4686be8fbe19f597f', 
        '0xbf590eec0b12668ec85966d489fba0eb4789f1bad03cc6896c95ca2f1422cbf1', 
        "0x642ef020f8c6999dc45d693db8c0179ee38630ed8b5e626284f83d761907a335"
    ]
}


const list = mock_account().map(recipient => {
    return {
        recipient, amount: 1
    }
})

describe('Transfer Module', () => {

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

        let recipients = list.map(item => item.recipient)

        const payload = batchcall.batchTransfer({
            recipientAddrs: recipients,
            depositAmounts: list.map(item => item.amount),
        });
        // const mock_coin = '0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180::mock_coin::MockCoin'

        let balances = await balanceOf(recipients)
        console.log('pre transfer balance:', JSON.stringify(balances.map(m=>m.amount)))
        
        const txnHash = await signAndSubmitTx(alice, payload)

        await waitForTx(txnHash);

        await delay(3000)

        balances = await balanceOf(recipients)
        console.log('has transfered balance:', JSON.stringify(balances.map(m=>m.amount)))
    })
})
