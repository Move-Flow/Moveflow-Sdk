import { NetworkConfiguration,  } from '../config';
import { createNetworkAdapter, NetworkAdapter } from '../modules';
import {AptosAccount, AptosClient, HexString} from "aptos";
// import {AccountKeys, Wallet} from '@manahippo/aptos-wallet-adapter';
export class SDK {

    protected aptos_client: AptosClient;

    protected _networkConfiguration: NetworkConfiguration;
    
    protected _stream: NetworkAdapter;
    
    get client() {
        return this.aptos_client 
    }

    get stream() {
        return this._stream;
    }

    get networkOptions() {
        return this._networkConfiguration;
    }

    constructor(networkConfiguration: NetworkConfiguration, account: AptosAccount, wallet: AptosAccount) {
        this.aptos_client = new AptosClient(networkConfiguration.fullNodeUrl);  
        this._networkConfiguration = networkConfiguration;
        this._stream = createNetworkAdapter(networkConfiguration.name, account, wallet as any);
    }
}