
import styled from 'styled-components/macro'
import SDK, { NetworkType } from 'sdk.js'

const AptosCoin = '0x1::aptos_coin::AptosCoin';

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


const rpc = 'https://testnet.aptoslabs.com'
    
const sdk = new SDK(rpc, NetworkType.Testnet)
      

const SignAndSubmitTransaction = async (transaction: any) => {

  const payload = Object.assign({}, transaction)

    await window.aptos.connect()
    console.log('Petra tx', payload)
    const pendingTransaction = await window.aptos.signAndSubmitTransaction(payload)
    console.log(pendingTransaction)
    return pendingTransaction.hash

  // }
}

export default function Test() {
  const create = async () => {
    const start_time = Math.floor(Date.now() / 1000).toString();
    const stop_time = Math.floor(Date.now() / 1000 + 60 * 60 * 24).toString();
 
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
 
    const txid = await SignAndSubmitTransaction( payload)

    console.log('txid', txid)
  }

  const pause = async () => {

    const payload = sdk.stream.pause({
      id: 29,
      coinType: AptosCoin,
    })

    const txid = await SignAndSubmitTransaction( payload)

    console.log('txid', txid)
  }

  const resume = async () => {

    const payload = sdk.stream.resume({
      id: 29,
      coinType: AptosCoin,
    })

    const txid = await SignAndSubmitTransaction( payload)

    console.log('txid', txid)
  }

  const close = async () => {

    const payload = sdk.stream.close({id: 29})

    const txid = await SignAndSubmitTransaction( payload)

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

    const txid = await SignAndSubmitTransaction( payload)

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
    <>
        <Wrapper id="swap-page">

          <br />
          <Button onClick={create}>Create</Button>

          <br />
          <Button onClick={pause}>Pause</Button>

          <br />
          <Button onClick={resume}>Resume</Button>

          <br />
          <Button onClick={close}>Close</Button>

          <br />
          <Button onClick={extend}>Extend</Button>

          <br />
          <Button onClick={incoming}>Incoming</Button>

          <br />
          <Button onClick={outgoing}>Outgoing</Button>

        </Wrapper>
        
    </>
  )

}
