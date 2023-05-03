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
    
const sdk = new SDK(TESTNET_CONFIG);

let stream = await sdk.create(from, to, 10, 1); // 创建流

await stream.pause(); 

await stream.resume();

await stream.close();

await stream.withdraw(5);

```
