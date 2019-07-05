/**
 * 智能合约转账
 */
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


