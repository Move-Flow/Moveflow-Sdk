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

    let stream = await sdk.create(from, to, 10, 1); // 创建流

    // let status = await stream.pause(); // 暂停流

    // status = await stream.resume(); // 继续流

    await stream.close()   // 关闭流

    await stream.withdraw(5); // 接收方取款


})();
```
