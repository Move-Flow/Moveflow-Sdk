export class NetworkConfiguration {
  constructor(
    public chain: string,                   // sui / aptos, 
    public network: string,                 // testnet / mainnet / devnet

    public fullNodeUrl: string,
    public faucetUrl: string,
    
    public incomingStreamObjectId: string,  // stream object id
    public outgoingStreamObjectId: string,  // stream object id
    public globalConfigObjectId: string,    // global config object id
    public packageObjectId: string,         // package object id

  ) { }
}

export const DEVNET_CONFIG = new NetworkConfiguration(
  'sui',
  'devnet',                                                             // name
  "https://fullnode.devnet.sui.io/",                                    // fullNodeUrl
  "",                                                                   // faucetUrl
  "0x5d6997de74fc6bc3c347c2805d794b60cec34db0d7179a545e27ea60e06bbbb4", // incoming stream object id
  "0xaf20e6f2588130598a9c0df8573c1177c2724f05bdfb39e2d67a15e320fde4c8", // outgoing stream object id
  "0xb75536c79c771ed02096954d1ed21cec1d92d5b833cd2571b42b5435c53f9a07", // global config object id
  "0x21383c9973e51348db3eaecdb95034eca8171bd00f1e3de4ab85ea4f2d697587"  // package object id
)

export const TESTNET_CONFIG = new NetworkConfiguration(
  'sui',
  'testnet',                                                            // name
  'https://fullnode.testnet.sui.io/',                                   // fullNodeUrl
  'https://faucet.testnet.aptoslabs.com',                               // faucetUrl
  "0xc692b2acc82596239bdec03005ed2ae9815e05f7ec32536c1169ba5328e15675", // incoming stream object id
  "0xd59b7671f4d2547680e3489bc664259bc4ecd78670de40b897bcde297eca5e99", // outgoing stream object id
  "0x2217bc9922316837220dfedbd1068533ee2dfd1a3073c16c76fb376e23b17d7e", // global config object id
  "0x21383c9973e51348db3eaecdb95034eca8171bd00f1e3de4ab85ea4f2d697587", // package object id
);

export const MAINNET_CONFIG = new NetworkConfiguration(
  'sui',
  'mainnet',                                                            // name
  'https://fullnode.mainnet.aptoslabs.com/v1',                          // fullNodeUrl
  '',                                                                   // faucetUrl
  "",                                                                   // incoming stream object id
  "",                                                                   // outgoing stream object id
  "",                                                                   // global config object id
  ""                                                                    // package object id
);
 


