
import { AptosAccount, Provider, Network, CoinClient, AptosClient } from "aptos";


const provider = new Provider(Network.TESTNET);

export async function signAndSubmitTx(sender: AptosAccount, payload: any): Promise<string> {

    const rawTxn = await provider.generateTransaction(sender.address(), payload);
    const bcsTxn = await provider.signTransaction(sender, rawTxn);
    const pendingTxn = await provider.submitTransaction(bcsTxn);

    return pendingTxn.hash;
}


export async function waitForTx(txnHash: string): Promise<void> {

    await provider.waitForTransaction(txnHash, { checkSuccess: true });

    console.log(`Txn: https://explorer.aptoslabs.com/txn/${txnHash}?network=testnet`);
}


export async function balanceOf(): Promise<bigint> {
    
    let url = 'https://testnet.aptoslabs.com/v1'
    const _client = new AptosClient(url);
    const coinClient = new CoinClient(_client)
    // const AptosCoin = '0x1::aptos_coin::AptosCoin'
    // console.log('address:', address)
    // console.log('coin_type:', coin_type)
    
    let balance = await coinClient.checkBalance('0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180');

    return balance

}


