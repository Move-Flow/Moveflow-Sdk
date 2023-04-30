import { SDK, CONFIGS } from './main'
import { SUI_COIN_TYPE, WBTC_COIN_TYPE, USDT_COIN_TYPE, Suiet_NFT_TYPE } from './constants'

describe('Token Module', () => {
    const sdk = new SDK(CONFIGS.testnet);
    const address = '0xa84b01c05ad237727daacb265fbf8d366d41567f10bb84b0c39056862250dca2';
    
    test('get token balance', async () => {
        const sui = await sdk.Coin.getCoinBalance(address, SUI_COIN_TYPE); 
        const wbtc = await sdk.Coin.getCoinBalance(address, WBTC_COIN_TYPE);
        const usdt = await sdk.Coin.getCoinBalance(address, USDT_COIN_TYPE);
        // console.log(`sui balance: ${JSON.stringify(sui, null, 2)}`)
        // console.log(`wbtc balance: ${JSON.stringify(wbtc, null, 2)}`)
        // console.log(`usdt balance: ${JSON.stringify(usdt, null, 2)}`)
    })
    test('get token balance', async () => {

        const nfts = await sdk.Coin.getNFTs(address, Suiet_NFT_TYPE);
        console.log(`suiet_nft count:  ${ nfts.data.length } `)
    
    })
})

describe('CoinList Module', () => {
    const sdk = new SDK(CONFIGS.testnet);
    
    test('get token balance', async () => {
        const coinlist = await sdk.CoinList.coinList
        // console.log(`coinlist: ${ JSON.stringify(coinlist, null, 2) }`)
    })
})