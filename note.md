1. 合约中的， name 和 remark 字段类型
create 用的类型 是 vector<u8>, 
name: vector<u8>,
remark: vector<u8>,
struct StreamInfo 中用到的是 String, 可不可以一统， 减少类型转换， 提高代码可读性


2. sdk 分开部署 两个npm包
    
    sdk-aptos
        可选网络: devnet, testnet, mainnet
        rpc 可选的 ，sdk 中有默认rpc

    sdk-sui
        devnet, testnet, mainnet
        devnet, testnet, mainnet
        rpc 可选的 ，里面有个默认rpc
    
3. 下周 5 前 完成可以完成 sui 的 sdk
