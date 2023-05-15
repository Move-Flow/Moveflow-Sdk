import {
    NetworkConfiguration as AptosNetworkConfiguration,
    APT_DEVNET_CONFIG,
    APT_TESTNET_CONFIG,
    APT_MAINNET_CONFIG
} from './configuration.aptos';

export const CONFIGS = {
    aptos_mainnet: APT_MAINNET_CONFIG,
    aptos_testnet: APT_TESTNET_CONFIG,
    aptos_devnet: APT_DEVNET_CONFIG,
};


export type NetworkConfiguration = AptosNetworkConfiguration;