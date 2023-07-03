import { AptosClient } from 'aptos'
// import { SwapModule } from './modules/SwapModule'
// import { MiscModule } from './modules/MiscModule'
// import { RouteModule } from './modules/RouteModule'
// import { RouteV2Module } from './modules/RouteV2Module'
// import { MasterChefModule } from './modules/MasterChefModule'
import { ResourcesModule } from './modules/ResourcesModule'
import { StreamModule } from './modules/StreamModule'
import { AptosResourceType } from './types/aptos'

export type SdkOptions = {
  nodeUrl: string
  networkOptions: {
    nativeCoin: AptosResourceType
    modules: {
      CoinInfo: AptosResourceType
      CoinStore: AptosResourceType
      Scripts: AptosResourceType
      ResourceAccountAddress: AptosResourceType
      DeployerAddress: AptosResourceType

      StreamModule: AptosResourceType

    } & Record<string, AptosResourceType>
    coins: {
      zUSDC: AptosResourceType
    } & Record<string, AptosResourceType>
  }
}

export enum NetworkType {
  Mainnet,
  Testnet,
}

export class SDK {
  protected _client: AptosClient
 
  protected _resources: ResourcesModule
  protected _stream: StreamModule
  protected _networkOptions: SdkOptions['networkOptions']
 
  get resources() {
    return this._resources
  }

  get stream() {
    return this._stream
  }

  get client() {
    return this._client
  }

  get networkOptions() {
    return this._networkOptions
  }

  /**
   * SDK constructor
   * @param nodeUrl string
   * @param networkType? NetworkType
   */
  constructor(nodeUrl: string, networkType?: NetworkType) {
    const mainnetOptions = {
      nativeCoin: '0x1::aptos_coin::AptosCoin',
      modules: {
        Scripts: '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207::moveflowPoolV1',
        CoinInfo: '0x1::coin::CoinInfo',
        CoinStore: '0x1::coin::CoinStore',
        
        ResourceAccountAddress: '0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf',
        
        DeployerAddress: '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207',
        StreamModule: '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207::stream',

      },
     
      coins: {
        zUSDC: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
      },
    }
    const testnetOptions = {
      nativeCoin: '0x1::aptos_coin::AptosCoin',
      modules: {
        Scripts: '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207::moveflowPoolV1f1',
        CoinInfo: '0x1::coin::CoinInfo',
        CoinStore: '0x1::coin::CoinStore',
        DeployerAddress: '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207',
        ResourceAccountAddress: '0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf',
        
        StreamModule: '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207::stream',
        
      },
   
      coins: {
        zUSDC: '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207::AnimeCoin::ANI',  // dummy
      },

    }
    let networkOptions = mainnetOptions  // default network
    
    if (networkType == NetworkType.Mainnet) networkOptions = mainnetOptions
    if (networkType == NetworkType.Testnet) networkOptions = testnetOptions

    const options = {
      nodeUrl,
      networkOptions: networkOptions,
    }
    this._networkOptions = options.networkOptions
    this._client = new AptosClient(options.nodeUrl)
   
    this._resources = new ResourcesModule(this)

    this._stream = new StreamModule(this)
  }
}
