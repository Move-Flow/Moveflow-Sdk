## Moveflow.js-SDK
The typescript SDK for [Moveflow](https://github.com/Move-flow/moveflow)

## Usage

### Install
```bash
yarn add @moveflow/sdk.js
```

### Test
```bash
yarn test
```

### Init SDK

```ts
import { SDK,TESTNET_CONFIG } from '@moveflow/sdk.js';
    
const { stream, client } = new SDK(CONFIGS.aptos_testnet, alice, alice);


 await stream.create(
        'aptos-test', 
        'remark', 
        bob.address.toString(), 
        1, 
        Date.now().toString(), 
        Date.now().toString(),  
        10, 
        false, 
        false 
    );


// query stream
let stream_list = await stream.query(address, 'outgoing');

let stream_id = "1"

await stream.close(stream_id);

await stream.pause(stream_id); 

await stream.resume(stream_id);

await stream.withdraw(streamId);

```
