/**
 * 智能合约转账
 */
require('./env');
const tokenHandle = require('./include/token_handle');

const data = {
  'address': '0xaf40d7a404bfbd10432c05ad92e2df7bdeca8c52',
  'amount': 100000,
};
const tokenHandleObj = new tokenHandle();
tokenHandleObj.setAbi('sky')
  .setWallet(process.env.MAIN_WALLET)
  .setWalletKey(process.env.MAIN_PRIVATE_KEY)
  .setContract(process.env.MAIN_CONTRACT_ADDRESS)
  .setGwei(7)
  .transfer(data['address'], data['amount']).then((res) => {
    console.log(res);
  }
);


