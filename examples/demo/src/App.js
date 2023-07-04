import './App.css'
import SDK, { NetworkType } from '@moveflow/sdk.js'

import styled from 'styled-components/macro'
const AptosCoin = '0x1::aptos_coin::AptosCoin'

const Wrapper = styled.div`
  position: relative;
  padding: 8px;
`

const Button = styled.div`
  position: relative;
  padding: 8px;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
`

// const rpc = 'https://testnet.aptoslabs.com'

const sdk = new SDK(NetworkType.Testnet)
const SignAndSubmitTransaction = async (transaction) => {

  const payload = Object.assign({}, transaction)

  await window.aptos.connect()
  console.log('Petra tx', payload)
  const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload)
  console.log(pendingTransaction)
  return pendingTransaction.hash
}


function App() {

  const batchTransfer = async () => {

    const list = [
      { recipient: "0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180", amount: "0.5" },
      { recipient: "0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180", amount: "0.5" },
    ]

    const payload = sdk.batchcall.batchTransfer({
      isIngoreUnregisterRecipient: true,
      recipientAddrs: list.map(item => item.recipient),
      depositAmounts: list.map(item => item.amount),
    });

    const txid = await SignAndSubmitTransaction(payload);

    console.log('txid', txid);
  }

  const create = async () => {
    const start_time = Math.floor(Date.now() / 1000).toString();
    const stop_time = Math.floor(Date.now() / 1000 + 60 * 60 * 24).toString();

    const payload = sdk.stream.create({

      recipientAddr: '0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180',
      depositAmount: 1,
      startTime: start_time,
      stopTime: stop_time,
      interval: 1000,
      // coinType: AptosCoin,
      // name: '1',
      // remark: '1',
      // canPause: true,
      // closeable: true,
      // recipientModifiable: true
    })

    const txid = await SignAndSubmitTransaction(payload)

    console.log('txid', txid)
  }

  const pause = async () => {

    const payload = sdk.stream.pause({
      id: 29,
      coinType: AptosCoin,
    })

    const txid = await SignAndSubmitTransaction(payload)

    console.log('txid', txid)
  }

  const resume = async () => {

    const payload = sdk.stream.resume({
      id: 29,
      coinType: AptosCoin,
    })

    const txid = await SignAndSubmitTransaction(payload)

    console.log('txid', txid)
  }

  const close = async () => {

    const payload = sdk.stream.close({ id: 29 })

    const txid = await SignAndSubmitTransaction(payload)

    console.log('txid', txid)
  }

  const extend = async () => {

    const payload = sdk.stream.extend({
      id: 30,
      extraAmount: 300,
      stopTime: '1635724800',
      ratePerInterval: '100',
      interval: '1000',
      coinType: AptosCoin,
    })

    const txid = await SignAndSubmitTransaction(payload)

    console.log('txid', txid)
  }

  const incoming = async () => {

    const res = await sdk.stream.getIncomingStreams('0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180')

    console.log('res: ', res)
  }

  const outgoing = async () => {

    const res = await sdk.stream.getOutgoingStreams('0x20f0cbe21cb340fe56500e0889cad03f8a9e54a33e3c4acfc24ce2bdfabc4180')

    console.log('res: ', res)

  }

  return (
    <div className="App">
      <header className="App-header">
        <Wrapper id="swap-page">
          <Button onClick={batchTransfer}>batchTransfer</Button>
          <Button onClick={create}>Create</Button>
          <Button onClick={pause}>Pause</Button>
          <Button onClick={resume}>Resume</Button>
          <Button onClick={close}>Close</Button>
          <Button onClick={extend}>Extend</Button>
          <Button onClick={incoming}>Incoming</Button>
          <Button onClick={outgoing}>Outgoing</Button>
        </Wrapper>
      </header>
    </div>
  );
}

export default App;
