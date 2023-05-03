import { SUI_CLOCK_OBJECT_ID, JsonRpcProvider, Connection, Ed25519Keypair, RawSigner, TransactionBlock } from "@mysten/sui.js";
import { NetworkConfiguration } from '../config/configuration';
import { CoinModule, CoinListModule, AptosStreamModule, SuiStreamModule } from '../modules';

export class SDK {

    protected _jsonRpcProvider: JsonRpcProvider;
    protected _networkConfiguration: NetworkConfiguration;
    protected _coin: CoinModule;
    protected _coinlist: CoinListModule;

    // protected _sui_stream: SuiStreamModule;
    // protected _aptos_stream: AptosStreamModule;
    protected _stream: SuiStreamModule | AptosStreamModule ;

    get jsonRpcProvider() {
        return this._jsonRpcProvider;
    }

    get stream() {
        return this._stream;
    }

    get coin() {
        return this._coin;
    }
    
    get coinList() {
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

        this._coin = new CoinModule(this);
        this._coinlist = new CoinListModule(this);

        this._stream = networkConfiguration.chain == 'sui' ?  new SuiStreamModule(this) : new AptosStreamModule(this);
        
    }
}