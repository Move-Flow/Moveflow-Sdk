
import { AptosAccount, Provider, Network, IndexerClient} from "aptos";


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


export async function balanceOf(_addresses: string[], _coin_type?: string): Promise<any[]> {

    const client = new IndexerClient('https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql')
    
    const addresses = _addresses
    const coin_type = _coin_type ?? '0x1::aptos_coin::AptosCoin'

    const query: string = `
        query get_current_coin_balances {
            current_coin_balances(
                limit: 10
                where: {
                    coin_type: { _eq: "${coin_type}" },
                    owner_address: { _in: ${JSON.stringify(addresses)} }
                }
            ) {
            coin_type
            amount
            coin_type_hash
            last_transaction_timestamp
            last_transaction_version
            owner_address
            coin_info {
                coin_type
                coin_type_hash
                creator_address
                decimals
                name
                symbol
                transaction_created_timestamp
                transaction_version_created
            }
        }
    }
    `

    let res = await client.queryIndexer({ query })
    return (res as any).current_coin_balances

}


export async function delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }


