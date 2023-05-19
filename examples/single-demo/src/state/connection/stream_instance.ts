import SDK, { 
  NetworkType, 
  // AptosCoinInfoResource, 
  // AptosCoinStoreResource, 
  // AptosLedgerInfo, 
  // AptosResource, 
  // AptosTransaction, 
  // SwapPoolResource, 
  // Utils 
} from 'sdk.js'

import { AptosClient } from 'aptos'
import { CHAIN_IDS_TO_SDK_NETWORK, SupportedChainId } from 'constants/chains'
import store from 'state'

// import { CHAIN_INFO } from 'constants/chainInfo'
// import { Pair } from 'hooks/common/Pair'
// import { addCoin, addTempCoin, setAllPairs, updatePair } from 'state/user/reducer'
// import { resetCoinBalances, resetLpBalances, setCoinBalances } from 'state/wallets/reducer'

import { ConnectionType, getRPCURL } from './reducer'

class StreamInstance {

  private static aptosClient: AptosClient
  private static sdk: SDK

  public static getAptosClient(): AptosClient {
    if (!StreamInstance.aptosClient) {
      const state = store.getState()
      StreamInstance.aptosClient = new AptosClient(
        getRPCURL(state.connection.currentConnection, state.user.chainId)
      )
    }
    return StreamInstance.aptosClient
  }

  public static renewAptosClient(connection: ConnectionType, chainId: SupportedChainId) {
    StreamInstance.aptosClient = new AptosClient(getRPCURL(connection, chainId))
  }

  public static getSDK(): SDK {
    if (!StreamInstance.sdk) {
      const state = store.getState()
      const networkType: NetworkType = CHAIN_IDS_TO_SDK_NETWORK[state.user.chainId]
      StreamInstance.sdk = new SDK(getRPCURL(state.connection.currentConnection, state.user.chainId), networkType)
    }
    return StreamInstance.sdk
  }

  public static renewSDK(connection: ConnectionType, chainId: SupportedChainId) {
    const networkType: NetworkType = CHAIN_IDS_TO_SDK_NETWORK[chainId]
    StreamInstance.sdk = new SDK(getRPCURL(connection, chainId), networkType)
  }

}

export default StreamInstance
