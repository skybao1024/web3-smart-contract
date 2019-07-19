# ETH Smart Contract Tool

## Requirements
- [Node 8+](https://nodejs.org/en/)

## Setup

```
cd web3-smart-contract
yarn install
```
cp .env.example .env

Configure the INFURA address, wallet, secret key, and contract address

NODE_ENV=development INFURA use ropsten and CHAIN_ID=3

NODE_ENV=production INFURA use mainnet and CHAIN_ID=1
```
NODE_ENV=development

INFURA_URL=https://ropsten.infura.io/v3/5cf998a52830435a8c2406da11d8ad15
INFURA_WS_URL=wss://ropsten.infura.io/ws/v3/5cf998a52830435a8c2406da11d8ad15
CHAIN_ID=3

MAIN_WALLET=0x4a601B5AAf1B101D0eb446A3EaA16b62F47b9Ed4

MAIN_PRIVATE_KEY=9B4347DEF1A73AB4DAE12F9D51FC3ACF470C601241241BE859EDC4E2BF215FD3

MAIN_CONTRACT_ADDRESS=0xFE0f0C43005D5Fc6Bb38188599d540639763007d

CUSTOM_CONTRACT_ADDRESS=0xaf40d7a404bfbd10432c05ad92e2df7bdeca8c52
```

## Running

Token Wallet Balance

```
require('./env');
const tokenHandle = require('./include/token_handle');

const tokenHandleObj = new tokenHandle();
tokenHandleObj.setMainAbi('sky')
    .setMainContract(process.env.MAIN_CONTRACT_ADDRESS)
    .balanceOf('0x514de9dca4f3730edb14ca5f11a07d3b8d2445e8')
    .then((res) => {
        console.log(res);
    }
);

```

Track Blockchain Transactions

```
// Track ETH
require('./env');
const watcherToken = require('./include/token_watcher');

// Track the ETH transactions
const tokenWatcher = new watcherToken();
tokenWatcher.watchEtherTransfers();

// Specify the address and quantity
const tokenWatcher = new watcherToken();
tokenWatcher.setFromAddress(['0x82c18159ad550c6a8015f409526fc5a17e283bb4'])
    .setToAddress(['0x514de9dca4f3730edb14ca5f11a07d3b8d2445e8'])
    .setAmount(100)
    .watchEtherTransfers();

```
```
// Track ERC20 Token
require('./env');
const watcherToken = require('./include/token_watcher');

// Track the ERC20 token transactions
const tokenWatcher = new watcherToken();
tokenWatcher.watchTokenTransfers();

// Specify the address and quantity
const tokenWatcher = new watcherToken();
tokenWatcher.setFromAddress(['0x82c18159ad550c6a8015f409526fc5a17e283bb4'])
    .setToAddress(['0x514de9dca4f3730edb14ca5f11a07d3b8d2445e8'])
    .setAmount(100)
    .watchTokenTransfers();

```
Contract Transfer

```
// Transfer
require('./env');
const tokenHandle = require('./include/token_handle');

const data = {
  'address': '0x514de9dca4f3730edb14ca5f11a07d3b8d2445e8',
  'amount': 10,
};
const tokenHandleObj = new tokenHandle();
tokenHandleObj.setAbi('sky')
  .setWallet(process.env.MAIN_WALLET)
  .setWalletKey(process.env.MAIN_PRIVATE_KEY)
  .setContract(process.env.MAIN_CONTRACT_ADDRESS)
  .setGwei(20)
  .transfer(data['address'], data['amount']).then((res) => {
    console.log(res);
  }
);

// Mass Transfer
const data = {
  'address': [
    '0xb59a6763b39e9257fe516874cf8bb680303ac444', 
    '0xd8a41aaa9e0515a9f6f4e865e5220773273cfc88'
  ],
  'amount': [10,10],
};
const tokenHandleObj = new tokenHandle();
tokenHandleObj.setAbi('sky_custom')
  .setMainAbi('sky')
  .setWallet(process.env.MAIN_WALLET)
  .setWalletKey(process.env.MAIN_PRIVATE_KEY)
  .setContract(process.env.CUSTOM_CONTRACT_ADDRESS) // The contract address
  .setMainContract(process.env.MAIN_CONTRACT_ADDRESS) // The contract address
  .setGwei(20)
  .setTransferMethod('sendCandy') // Custom contract method
  .massTransfer(data['address'], data['amount'])
  .then((res) => {
    console.log(res);
  }
);

```

## Contract File

```
The contract file used in the case is in the src/resource/sol directory. 
You are free to modify and generate your own ERC20 token and bulk transfer contract.
```

