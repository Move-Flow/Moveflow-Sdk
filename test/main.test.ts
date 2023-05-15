import { SDK, CONFIGS } from '../src/main'
import { AptosClient, AptosAccount, FaucetClient, CoinClient, BCS, TxnBuilderTypes } from "aptos";

const {
    AccountAddress,
    TypeTagStruct,
    EntryFunction,
    StructTag,
    TransactionPayloadEntryFunction,
    RawTransaction,
    ChainId,
  } = TxnBuilderTypes;

describe('Token Module', () => {

        const alice = new AptosAccount();
        const bob = new AptosAccount(); // <:!:section_2

        // Print out account addresses.
        console.log("=== Addresses ===");
        console.log(`Alice: ${alice.address()}`);
        console.log(`Bob: ${bob.address()}`);
        console.log("");

    const { stream, client } = new SDK(CONFIGS.aptos_testnet, alice, alice);

    test('get token balance', async () => {

        let address = '0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180';
        let balance = await client.getAccount(address);
        
        console.log('balance: ', balance);
    })

    test('create stream ',async () => {
        await stream.create(
            'aptos-test', 
            'remark', 
            bob.address.toString(), 
            1, 
            Date.now().toString(), 
            Date.now().toString(),  
            10, 
            false, 
            false 
        );
    })
    
    test('query stream ',async () => {
        let address = bob.address.toString();
        await stream.query(address, 'outgoing');
    })
    
    test('close stream ',async () => {
        let streamId = '1'
        await stream.close(streamId);
    })

    test('close stream ',async () => {
        
        let streamId = '1';

        await stream.pause(streamId);

    })

    test('withdraw stream ',async () => {
        
        // let streamId = '1';

        // await stream.withdraw(streamId);

    })
})