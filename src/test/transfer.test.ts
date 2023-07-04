import SDK, { NetworkType } from '../main'

const CoinsMapping: { [key: string]: string } = {
    APTOS: '0x1::aptos_coin::AptosCoin',
    USDT_MOCK: '0xae478ff7d83ed072dbc5e264250e67ef58f57c99d89b447efd8a0a2e8b2be76e::coin::T',
}

describe('Transfer Module', () => {
    // const coinType = CoinsMapping.APTOS;

    const { batchcall } = new SDK(NetworkType.Testnet)

    test('batchTransfer', async () => {
        const output = batchcall.batchTransfer({
            recipientAddrs: [
                '0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180',
                '0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180'
            ],
            depositAmounts: [
                0.1,
                0.2
            ],
        })

        console.log("output:", output)
    })


})
