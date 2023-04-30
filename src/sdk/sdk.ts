import { Connection, JsonRpcProvider} from '@mysten/sui.js';
import { NetworkConfiguration } from '../config/configuration';
import { CoinModule, CoinListModule } from '../modules';

export class SDK {
    protected _jsonRpcProvider: JsonRpcProvider;
    protected _networkConfiguration: NetworkConfiguration;
    protected _token: CoinModule;
    protected _coinlist: CoinListModule;

    get jsonRpcProvider() {
        return this._jsonRpcProvider;
    }

    get Coin() {
        return this._token;
    }
    
    get CoinList() {
        return this._coinlist;
    }

    get networkOptions() {
        return this._networkConfiguration;
    }

    constructor(networkConfiguration: NetworkConfiguration) {
        this._jsonRpcProvider = new JsonRpcProvider(
            new Connection({fullnode: networkConfiguration.fullNodeUrl})
        )
        this._networkConfiguration = networkConfiguration;
        this._token = new CoinModule(this);
        this._coinlist = new CoinListModule(this);
    }
}