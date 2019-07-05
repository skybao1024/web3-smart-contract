/**
 * 智能合约批量转账
 */
require('./env');
const tokenHandle = require('./include/token_handle');

const data = {
  'address': ['0xb59a6763b39e9257fe516874cf8bb680303ac444', '0xd8a41aaa9e0515a9f6f4e865e5220773273cfc88'],
  'amount': [10,10],
};
const tokenHandleObj = new tokenHandle();
tokenHandleObj.setAbi('ctc_custom')
  .setWallet(process.env.MAIN_WALLET)
  .setWalletKey(process.env.MAIN_PRIVATE_KEY)
  .setContract(process.env.CUSTOM_CONTRACT_ADDRESS)
  .setGwei(7)
  .setTransferMethod('sendCandy')
  .massTransfer(data['address'], data['amount'])
  .then((res) => {
    console.log(res);
  }
);