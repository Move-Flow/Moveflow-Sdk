## Getting Started

Create a project using this example:

```bash
yarn add @moveflow/sdk-aptos
```

### use sdk

```
const sdk = new SDK(Network.TESTNET)
``` 

### submit Stream tx

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
2. batch create streams
    ```javascript
    const batchCreate = async () => {
        const start_time = Math.floor(Date.now() / 1000).toString();
        const stop_time = Math.floor(Date.now() / 1000 + 60 * 60 * 24).toString();

        const payload = sdk.stream.batchCreate({
            recipientAddrs: [
                '0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180',
                '0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180'
            ],
            depositAmounts: [0.1, 0.2],
            startTime: start_time,
            stopTime: stop_time,
            name: 'batch_create_0x2',
            remark: 'batch_create_0x2',
            interval: 1000,
        });
        const txid = await SignAndSubmitTransaction(payload);
    }

    ```

3. pause a stream

```
const payload = sdk.stream.pause({
    id: 29,
    coinType: AptosCoin,
})

const txid = await SignAndSubmitTransaction(payload)

```

4. resume a stream

```
 const payload = sdk.stream.resume({
      id: 29,
    coinType: AptosCoin,
})

const txid = await SignAndSubmitTransaction(payload)

```

5. close a stream 

```
    const payload = sdk.stream.close({ id: 29 })
    const txid = await SignAndSubmitTransaction(payload)
````


6. extend a stream

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
