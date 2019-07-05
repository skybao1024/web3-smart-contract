# ETH Smart Contract Tool

## Requirements
- [Node 8+](https://nodejs.org/en/)

## Setup

```
cd web3-smart-contract
yarn install
```
cp .env.example .env

配置INFURA地址，钱包，秘钥，合约地址

NODE_ENV=development INFURA 使用 ropsten，CHAIN_ID=3

NODE_ENV=production INFURA 使用 mainnet，CHAIN_ID=1
```
NODE_ENV=development

INFURA_URL=https://ropsten.infura.io/v3/5cf998a52830435a8c2406da11d8ad15
INFURA_WS_URL=wss://ropsten.infura.io/ws/v3/5cf998a52830435a8c2406da11d8ad15
CHAIN_ID=3

MAIN_WALLET=0x82c18159ad550c6a8015f409526fc5a17e283bb4

MAIN_PRIVATE_KEY=4be9b52ea65f878931e6c1bd90a68483a7a2ca3f420447347343ffca155f2052

MAIN_CONTRACT_ADDRESS=0x92fe8A79D123C57F3714f564ef7985184f6e94a6

CUSTOM_CONTRACT_ADDRESS=0xc4b8c61aea670dc56b7443e796035641c04be0fe
```

## Running

智能合约监控

```
// 监控ETH
require('./env');
const watcherToken = require('./include/token_watcher');

// 监控ETH transfer 记录
const tokenWatcher = new watcherToken();
tokenWatcher.watchEtherTransfers();

// 指定监控地址和数量
const tokenWatcher = new watcherToken();
tokenWatcher.setFromAddress('0x82c18159ad550c6a8015f409526fc5a17e283bb4')
    .setToAddress('0x514de9dca4f3730edb14ca5f11a07d3b8d2445e8')
    .setAmount(100)
    .watchEtherTransfers();

```
```
// 监控ERC20 Token
require('./env');
const watcherToken = require('./include/token_watcher');

// 监控Token transfer 记录
const tokenWatcher = new watcherToken();
tokenWatcher.watchTokenTransfers();

// 指定监控地址和数量
const tokenWatcher = new watcherToken();
tokenWatcher.setFromAddress('0x82c18159ad550c6a8015f409526fc5a17e283bb4')
    .setToAddress('0x514de9dca4f3730edb14ca5f11a07d3b8d2445e8')
    .setAmount(100)
    .watchTokenTransfers();

```
智能合约转账

```
// 合约转账
require('./env');
const tokenHandle = require('./include/token_handle');

const data = {
  'address': '0x514de9dca4f3730edb14ca5f11a07d3b8d2445e8',
  'amount': 10,
};
const tokenHandleObj = new tokenHandle();
tokenHandleObj.setAbi('ctc')
  .setWallet(process.env.MAIN_WALLET)
  .setWalletKey(process.env.MAIN_PRIVATE_KEY)
  .setContract(process.env.MAIN_CONTRACT_ADDRESS)
  .setGwei(7)
  .transfer(data['address'], data['amount']).then((res) => {
    console.log(res);
  }
);

// 合约批量转账
const data = {
  'address': ['0xb59a6763b39e9257fe516874cf8bb680303ac444', '0xd8a41aaa9e0515a9f6f4e865e5220773273cfc88'],
  'amount': [10,10],
};
const tokenHandleObj = new tokenHandle();
tokenHandleObj.setAbi('ctc_custom')
  .setWallet(process.env.MAIN_WALLET)
  .setWalletKey(process.env.MAIN_PRIVATE_KEY)
  .setContract(process.env.CUSTOM_CONTRACT_ADDRESS) // 只能合约地址
  .setGwei(7)
  .setTransferMethod('sendCandy') // 合约批量转账对应的方法
  .massTransfer(data['address'], data['amount'])
  .then((res) => {
    console.log(res);
  }
);

```

