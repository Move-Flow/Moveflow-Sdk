// import { NetworkType as SuiNetworkType } from '@moveflow.org/sui-v1-sdk'
import { NetworkType } from 'sdk.js'

export enum SupportedChainId {
  APTOS = 1,
  APTOS_TESTNET = 2,
  APTOS_DEVNET = 34,
  // SUI = 100,
  // SUI_TESTNET = 101,
  // SUI_DEVNET = 102,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.APTOS]: 'aptos',
  [SupportedChainId.APTOS_TESTNET]: 'aptos_testnet',
  [SupportedChainId.APTOS_DEVNET]: 'aptos_devnet',
}

export const CHAIN_IDS_TO_SDK_NETWORK = {
  [SupportedChainId.APTOS]: NetworkType.Mainnet,
  [SupportedChainId.APTOS_TESTNET]: NetworkType.Testnet,
}

export function isSupportedChain(chainId: number | undefined): chainId is SupportedChainId {
  return !!chainId && !!SupportedChainId[chainId]
}

export function isAptosChain(chainId: number | undefined): chainId is SupportedChainId {
  return (
    chainId === SupportedChainId.APTOS ||
    chainId === SupportedChainId.APTOS_TESTNET ||
    chainId === SupportedChainId.APTOS_DEVNET
  )
}
 