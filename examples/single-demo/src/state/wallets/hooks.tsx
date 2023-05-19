import { Utils } from 'sdk.js'
import { SupportedChainId } from 'constants/chains'
import { Coin, CoinAmount, useCoin } from 'hooks/common/Coin'
import { useCallback } from 'react'
import store from 'state'
import { useAppDispatch, useAppSelector } from 'state/hooks'

import { addConnectedWallet, setAccount, setSelectedWallet, setWalletChain } from './reducer'
import { Wallet, WalletType } from './types'

export function useCoinBalance(address: string): string | undefined {
  return useAppSelector((state) => state.wallets.coinBalances[address])
}

export function useCoinAmount(address: string): CoinAmount<Coin> {
  const coinBalance = useCoinBalance(address)
  const coin = useCoin(address)
  return new CoinAmount(coin, Utils.d(coinBalance))
}

export function useAllCoinBalance(): { [address: string]: string } {
  return useAppSelector((state) => state.wallets.coinBalances)
}

export function useLpBalance(pairKey: string): string | undefined {
  return useAppSelector((state) => state.wallets.lpBalances[pairKey])
}

export function useAllLpBalance(): { [pairKey: string]: string } {
  return useAppSelector((state) => state.wallets.lpBalances)
}

export function useAccount(): string | undefined {
  return useAppSelector((state) => state.wallets.account)
}

export function useWallet(): WalletType {
  return useAppSelector((state) => state.wallets.selectedWallet)
}

export function useWalletNetwork(): SupportedChainId {
  return useAppSelector((state) => state.wallets.walletChain)
}

export function useConnectedWallets(): [Wallet[], (wallet: Wallet) => void] {
  const dispatch = useAppDispatch()
  const connectedWallets = useAppSelector((state) => state.wallets.connectedWallets)
  const addWallet = useCallback(
    (wallet: Wallet) => {
      dispatch(addConnectedWallet(wallet))
    },
    [dispatch]
  )
  return [connectedWallets, addWallet]
}

export async function AutoConnectAptosWallets() {

  const prevWallet = store.getState().wallets.selectedWallet

  switch (prevWallet) {
    case WalletType.PETRA:
      if (await AutoConnectPetra()) return
      break
    case WalletType.RISE:
      if (await AutoConnectRise()) return
      break
  }
  if (await AutoConnectPetra()) return
  if (await AutoConnectRise()) return
}

function PetraNetworkToChainId(network: string) {
  switch (network) {
    case 'Mainnet':
      return SupportedChainId.APTOS
    case 'Testnet':
      return SupportedChainId.APTOS_TESTNET
    case 'Devnet':
      return SupportedChainId.APTOS_DEVNET
    default:
      return SupportedChainId.APTOS
  }
}

export async function AutoConnectPetra() {
  if (!('aptos' in window)) {
    return false
  }
  try {
    if (await ConnectPetra()) {
      console.log('Petra auto connected')
      return true
    }
  } catch (error) {
    console.error(error)
  }
}

export async function ConnectPetra() {
  try {
    const res = await window.aptos.connect()
    store.dispatch(setSelectedWallet({ wallet: WalletType.PETRA }))
    store.dispatch(setAccount({ account: res.address }))
    console.log('Petra wallet connect success')
    const network = await window.aptos.network()
    store.dispatch(setWalletChain({ chainId: PetraNetworkToChainId(network) }))
    window.aptos.onNetworkChange((network) => {
      if (store.getState().wallets.selectedWallet === WalletType.PETRA) {
        store.dispatch(setWalletChain({ chainId: PetraNetworkToChainId(network.networkName) }))
      }
    })
    return true
  } catch (error) {
    console.error(error)
  }
}

export async function AutoConnectRise() {
  if (!('rise' in window)) {
    return false
  }
  try {
    if (await ConnectRise()) {
      console.log('Rise auto connected')
      return true
    }
  } catch (error) {
    console.error(error)
  }
  return false
}

export async function ConnectRise() {
  try {
    const res = await window.rise.connect()
    store.dispatch(setSelectedWallet({ wallet: WalletType.RISE }))
    store.dispatch(setAccount({ account: window.rise.address }))
    console.log('Rise wallet connect success')
    return true
  } catch (error) {
    console.error(error)
  }
}

export const ResetConnection = () => {
  store.dispatch(setSelectedWallet({ wallet: WalletType.PETRA }))
  store.dispatch(setAccount({ account: undefined }))
}

export const SignAndSubmitTransaction = async (chainId: SupportedChainId, transaction: any) => {

  const payload = Object.assign({}, transaction)

  switch (store.getState().wallets.selectedWallet) {
    case WalletType.RISE:

      const riseTx = await window.rise.signAndSubmitTransaction(payload)

      console.log('Rise tx', riseTx)

      return riseTx.hash
      
    case WalletType.PETRA:
      await window.aptos.connect()
      console.log('Petra tx', payload)
      const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload)
      console.log(pendingTransaction)
      return pendingTransaction.hash

  }
}