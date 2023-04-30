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
(async function main() {
    
    const sdk = new SDK(TESTNET_CONFIG);

    let stream = await sdk.create(from, to, 10, 1);

    let is_paused = await stream.pause(); // 暂停

    is_paused = await stream.resume(); // 继续

    // let 


})();
```
