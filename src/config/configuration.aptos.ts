// import { NetworkConfiguration } from "./index";


export const aptosConfigType = "stream::GlobalConfig";
export const aptosStreamType = "stream::StreamInfo"

export class NetworkConfiguration {
  constructor(
    public name: string,
    public fullNodeUrl: string,
    public faucetUrl: string,
    public contract: string,
    public backend: string,
    public backendNet: string,
    public isMainNet = false
  ) {}
}

export const APT_DEVNET_CONFIG = new NetworkConfiguration(
  'devnet',
  'https://fullnode.devnet.aptoslabs.io',
  'https://faucet.devnet.aptoslabs.com',
  '0x6b65512795f4cb492e2d8713b3ce1aba624516479c3b7b51a73b91cfa3a5b16f',
  'https://api.moveflow.xyz/api',
  'apt_devnet'
);

export const APT_TESTNET_CONFIG = new NetworkConfiguration(
  'aptos',
  'https://fullnode.testnet.aptoslabs.com/v1',
  'https://faucet.testnet.aptoslabs.com',
  '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207',
  'https://api.moveflow.xyz/api',
  'apt_testnet',
);

export const APT_MAINNET_CONFIG = new NetworkConfiguration(
  'mainnet',
  'https://fullnode.mainnet.aptoslabs.com/v1',
  '',
  'contract',
  'backend',
  'apt_mainnet'
);

// const getNetworkConfiguration = (env: string): NetworkConfiguration => {
//   switch (env) {
//     case "devnet":
//       return APT_DEVNET_CONFIG;
//     case "testnet":
//       return APT_TESTNET_CONFIG;
//     case "mainnet":
//       return APT_MAINNET_CONFIG;
//     default:
//       return APT_TESTNET_CONFIG;
//   }
// };

// const netConfApt = getNetworkConfiguration('testnet' as string);

// export default netConfApt;