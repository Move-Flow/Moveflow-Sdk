import { SDK, CONFIGS } from '../src/main'
import { SUI_COIN_TYPE, WBTC_COIN_TYPE, USDT_COIN_TYPE, Suiet_NFT_TYPE } from '../src/constants'

describe('Token Module', () => {
    const sdk = new SDK(CONFIGS.sui_testnet);
    const address = '0xa84b01c05ad237727daacb265fbf8d366d41567f10bb84b0c39056862250dca2';
    
    test('get token balance', async () => {
        // const sui = await sdk.Coin.getCoinBalance(address, SUI_COIN_TYPE); 
        // const wbtc = await sdk.Coin.getCoinBalance(address, WBTC_COIN_TYPE);
        // const usdt = await sdk.Coin.getCoinBalance(address, USDT_COIN_TYPE);
    })
    test('get token balance', async () => {
        // const nfts = await sdk.Coin.getNFTs(address, Suiet_NFT_TYPE);
        // console.log(`suiet_nft count:  ${ nfts.data.length } `)
    })
})

describe('CoinList Module', () => {
    const sdk = new SDK(CONFIGS.sui_testnet);
    
    test('get token balance', async () => {
        // const coinlist = await sdk.CoinList.coinList
        // console.log(`coinlist: ${ JSON.stringify(coinlist, null, 2) }`)
    })
})