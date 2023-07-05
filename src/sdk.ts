import { AptosClient, CoinClient, Provider, Network } from 'aptos'
import { ResourcesModule } from './modules/ResourcesModule'
import { StreamModule } from './modules/StreamModule'
import { TransferModule } from './modules/TransferModule'

import { AptosResourceType } from './types/aptos'

export type SdkOptions = {
  nodeUrl: string
  networkOptions: {
    nativeCoin: AptosResourceType
    modules: {
      CoinInfo: AptosResourceType
      CoinStore: AptosResourceType
      ResourceAccountAddress: AptosResourceType
      DeployerAddress: AptosResourceType
      StreamModule: AptosResourceType
      TransferModule: AptosResourceType
    } & Record<string, AptosResourceType>
  }
}

export class SDK {
  protected _client: AptosClient
  protected _coin: CoinClient
  protected _resources: ResourcesModule
  protected _stream: StreamModule
  protected _batchcall: TransferModule
  protected _provider: Provider

  protected _networkOptions: SdkOptions['networkOptions']
 
  get resources() {
    return this._resources
  }

  get stream() {
    return this._stream
  }

  get batchcall() {
    return this._batchcall
  }

  get client() {
    return this._client
  }
  
  get coin() {
    return this._coin
  }

  get networkOptions() {
    return this._networkOptions
  }

  get provider() {
    return this._provider
  }

  /**
   * SDK constructor
   * @param nodeUrl string
   * @param Network? Network
   */
  constructor(network?: Network, nodeUrl?: string) {
    const mainnetOptions = {
      nativeCoin: '0x1::aptos_coin::AptosCoin',
      modules: {
        CoinInfo: '0x1::coin::CoinInfo',
        CoinStore: '0x1::coin::CoinStore',
        ResourceAccountAddress: '0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf',
        DeployerAddress: '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207',
        StreamModule: '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207::stream',
        TransferModule: '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207::Transfer',
      },
    }
    const testnetOptions = {
      nativeCoin: '0x1::aptos_coin::AptosCoin',
      modules: {
        CoinInfo: '0x1::coin::CoinInfo',
        CoinStore: '0x1::coin::CoinStore',
        DeployerAddress: '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207',
        ResourceAccountAddress: '0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf',
        StreamModule: '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207::stream',
        TransferModule: '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207::Transfer',
      },
    }
    let networkOptions = mainnetOptions  // default network
    
    if (network == Network.MAINNET) networkOptions = mainnetOptions
    if (network == Network.TESTNET) networkOptions = testnetOptions

    nodeUrl = nodeUrl || (network == Network.MAINNET
          ? 'https://fullnode.mainnet.aptoslabs.com/v1' 
          : 'https://testnet.aptoslabs.com');

    const options = { nodeUrl, networkOptions: networkOptions }

    this._networkOptions = options.networkOptions
    this._client = new AptosClient(options.nodeUrl)
    this._coin = new CoinClient(this._client)

    this._resources = new ResourcesModule(this)

    this._stream = new StreamModule(this)

    this._batchcall = new TransferModule(this)

    this._provider = new Provider(network || Network.TESTNET)
  }
}
