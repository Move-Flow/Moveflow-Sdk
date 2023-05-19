## Getting Started

Create a project using this example:

```bash
yarn add @moveflow/sdk.js
```

You can start editing the page by modifying `src/App.tsx`. The page auto-updates as you edit the file.

### use sdk

Deploy a copy of your application to IPFS using the following command:
 
```
const rpc = https://testnet.aptoslabs.com
const sdk = new SDK(rpc, NetworkType.Testnet)
```

### submit tx

1.  create a stream

    ```
    const payload = sdk.stream.create({

      recipientAddr: '0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180',
      depositAmount: 1,
      startTime: start_time,
      stopTime: stop_time,
      // coinType: AptosCoin,
      interval: 1000,
      // name: '1',
      // remark: '1',
      // canPause: true,
      // closeable: true,
      // recipientModifiable: true

    })

    const txid = await SignAndSubmitTransaction(payload)
    ```

2. pause a stream

```
const payload = sdk.stream.pause({
    id: 29,
    coinType: AptosCoin,
})

const txid = await SignAndSubmitTransaction(payload)

```

3. resume a stream

```
 const payload = sdk.stream.resume({
      id: 29,
    coinType: AptosCoin,
})

const txid = await SignAndSubmitTransaction(payload)

```

4. close a stream 
```
const payload = sdk.stream.close({ id: 29 })
const txid = await SignAndSubmitTransaction(payload)
````

5. extend a stream

```
const payload = sdk.stream.extend({
    id: 30,
    extraAmount: 300,
    stopTime: '1635724800',
    ratePerInterval: '100',
    interval: '1000',
    coinType: AptosCoin,
})

const txid = await SignAndSubmitTransaction(payload)
```


### query streams 

1. query incoming streams
```
const address = `0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180`
const res = await sdk.stream.getIncomingStreams(address);


```

2. query outgoing streams

```
const address = `0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180`
const res = await sdk.stream.getOutgoingStreams(address)
```


## Learn More

To learn more about thirdweb, React and CRA, take a look at the following resources:

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started) - learn about CRA features.
- [React documentation](https://reactjs.org/) - learn React.

You can check out [the thirdweb GitHub organization](https://github.com/thirdweb-dev) - your feedback and contributions are welcome!

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
