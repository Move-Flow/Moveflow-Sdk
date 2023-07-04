import SDK, { NetworkType } from '../main'

// const CoinsMapping: { [key: string]: string } = {
//     APTOS: '0x1::aptos_coin::AptosCoin',
//     USDT_MOCK: '0xae478ff7d83ed072dbc5e264250e67ef58f57c99d89b447efd8a0a2e8b2be76e::coin::T',
// }
// const coinType = CoinsMapping.APTOS;

const list = [
    { recipient: "0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180", amount: 0.5 },
    { recipient: "0x21e1b39cc598cc1c9f858585e303d36bc8b5451b580b83c4686be8fbe19", amount: 0.5 },
]

describe('Transfer Module', () => {

    const { batchcall } = new SDK(NetworkType.Testnet)

    test('batchTransfer', async () => {
        const output = batchcall.batchTransfer({
            recipientAddrs: list.map(item => item.recipient),
            depositAmounts: list.map(item => item.amount),
        });

        console.log("output:", output)
        expect(1).toBe(1)
    })

    test('checkRegister', async () => {

        let recipients = list.map(item => item.recipient)
        let checked = await batchcall.checkRegister(recipients)

        console.log("output:", checked)
        expect(1).toBe(1)
    })
})
