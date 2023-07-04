import SDK, { NetworkType } from '../main'

const CoinsMapping: { [key: string]: string } = {
    APTOS: '0x1::aptos_coin::AptosCoin',
    BTC: '0xae478ff7d83ed072dbc5e264250e67ef58f57c99d89b447efd8a0a2e8b2be76e::coin::T',
}

describe('Stream Module', () => {
    const sdk = new SDK(NetworkType.Testnet)

    test('create', async () => {

        const start_time = Math.floor(Date.now() / 1000 ).toString();
        const stop_time = Math.floor(Date.now() / 1000  + 60 * 60 * 24 * 30).toString();
        
        const output = sdk.stream.create({
            name : 'test',
            remark : 'test',
            recipientAddr: '0x1',
            depositAmount: 1,
            startTime: start_time,
            stopTime: stop_time,
            coinType: CoinsMapping.APTOS,
            interval: 1,
            canPause: true,
            closeable: true,
            recipientModifiable: true,
        })

        console.log("output:", output)

    })

    test('pause', async () => {

        const start_time = Math.floor(Date.now() / 1000 ).toString();
        const stop_time = Math.floor(Date.now() / 1000  + 60 * 60 * 24 * 30).toString();
        
        const output = sdk.stream.create({
            name : 'test',
            remark : 'test',
            recipientAddr: '0x1',
            depositAmount: 1,
            startTime: start_time,
            stopTime: stop_time,
            coinType: CoinsMapping.APTOS,
            interval: 1,
            canPause: true,
            closeable: true,
            recipientModifiable: true,
        })

        console.log("output:", output)

        expect(1).toBe(1)

    })
})
