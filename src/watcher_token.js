/**
 * 监控合约地址
 */
require('./env');
const watcher_token = require('./include/token_watcher');

const tokenWatcher = new watcher_token();
tokenWatcher.setAbi('sky')
  .setContract(process.env.MAIN_CONTRACT_ADDRESS)
  .setToAddress(['0x514de9dca4f3730edb14ca5f11a07d3b8d2445e8'])
  .watchTokenTransfers();
console.log('Started watching token transfers\n');