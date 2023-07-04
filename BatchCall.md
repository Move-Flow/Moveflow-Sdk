## Getting Started

Create a project using this example:

```bash
yarn add @moveflow/sdk.js
```

### Use Sdk in your code

```
const { batchcall } = new SDK(NetworkType.Testnet)
```

### sdk method

1. batchTransfer: `batchTransfer(input: batchTransferPayload)`

Because tokens of type CoinType may be transferred to non-existing accounts, 
users need to first create a recipient account and register to be able to receive CoinType before transferring tokens


The parameters that need to be:

* recipientAddrs: Receiver address for transferring tokens
* depositAmounts: Amount of transferred tokens
* coinType: The currency of the transfer token, the default is APT

```javascript
export type batchTransferPayload = {
  recipientAddrs: string[],
  depositAmounts: number[],
  coinType?: string
}
```

2. For example, airdrop Aptos tokens to two accounts:

```javascript
const payload = sdk.batchcall.batchTransfer({
    recipientAddrs: [
        '0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180',
        '0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180'
    ],
    depositAmounts: [
        0.001,
        0.002
    ],
});

const txid = await SignAndSubmitTransaction(payload);

```
