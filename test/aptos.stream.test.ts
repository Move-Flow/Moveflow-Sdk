import { SDK, CONFIGS } from '../src/main'
import { SUI_COIN_TYPE } from '../src/constants'
import { Ed25519Keypair, RawSigner } from "@mysten/sui.js";

const  mnemonic = 'future please eager illness dog pitch horror quit use access mom endless'
const path = "m/44'/784'/0'/0'/0'";
const keypair = Ed25519Keypair.deriveKeypair(mnemonic, path);
const { stream, jsonRpcProvider: provider } = new SDK(CONFIGS.aptos_testnet);

const sender = new RawSigner(keypair, provider);
const recipient =  '0xa84b01c05ad237727daacb265fbf8d366d41567f10bb84b0c39056862250dca2' 

describe('Stream Module', () => {

    test('create stream', async () => {
        const start_time = 1680503400000 
        const stop_time = 1680603400000 
        const deposit_amount = 200000000;
        
        await stream.create(
            sender, 
            recipient,
            deposit_amount,
            start_time,
            stop_time, 
        );
        console.log(`stream: ${ JSON.stringify(stream, null, 2) }`)
    })

    test('query stream list', async () => {

        const stream_list = await stream.query(recipient, 'outgoing');
        
        console.log(`stream: ${ JSON.stringify(stream_list, null, 2) }`);
        
    })
})