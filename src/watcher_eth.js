/**
 * 监控ETH
 */
require('./env');
const watcherToken = require('./include/token_watcher');

const tokenWatcher = new watcherToken();
tokenWatcher.watchEtherTransfers();
console.log('Started watching ETH transfers\n');