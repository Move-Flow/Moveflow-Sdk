import SDK, { NetworkType } from '../main'

// const CoinsMapping: { [key: string]: string } = {
//     APTOS: '0x1::aptos_coin::AptosCoin',
//     USDT_MOCK: '0xae478ff7d83ed072dbc5e264250e67ef58f57c99d89b447efd8a0a2e8b2be76e::coin::T',
// }

// const coinType = CoinsMapping.APTOS;

describe('Transfer Module', () => {

    const { batchcall } = new SDK(NetworkType.Testnet)
    test('batchTransfer', async () => {
        let output = batchcall.batchTransfer({
            recipientAddrs: [
                '0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180',
                '0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180'
            ],
            depositAmounts: [
                0.0001,
                0.0002
            ],
        })

        console.log("output:", output)
        expect(1).toBe(1)
    })

    test('verify', async () => {
        let output = await batchcall.verify({
            recipientAddrs: [
                '0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180',
                '0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180'
            ],
            depositAmounts: [
                0.0001,
                0.0002
            ],
        })

        console.log("output:", output)
        expect(1).toBe(1)
    })


})
