const Web3 = require('web3');
const Decimal = require('decimal.js');

class TokenWatcher {
  constructor() {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_WS_URL));
  }

  openHttp() {
    this.web3_http = new Web3(process.env.INFURA_URL);
  }

  /**
   * 设置合约
   * @param contract
   * @returns {TokenWatcher}
   */
  setContract(contract) {
    this.token_contract = contract;
    return this;
  }

  /**
   * 引入子合约ABI
   * @param name
   * @returns {TokenWatcher}
   */
  setAbi(name) {
    this.token_abi = require('../resource/abi/'+name);
    return this;
  }

  /**
   * 设置监控From地址
   * @param address
   * @returns {TokenWatcher}
   */
  setFromAddress(address) {
    this.from_address = address;
    return this;
  }

  /**
   * 设置监控To地址
   * @param address
   * @returns {TokenWatcher}
   */
  setToAddress(address) {
    this.to_address = address;
    return this;
  }

  /**
   * 设置监听Amount
   * @param amount
   * @returns {TokenWatcher}
   */
  setAmount(amount) {
    this.amount = amount;
    return this;
  }

  /**
   * ETH 监听转账记录
   */
  watchEtherTransfers() {
    this.watch_type = 1;
    // Instantiate subscription object
    const subscription = this.web3.eth.subscribe('pendingTransactions');

    // Subscribe to pending transactions
    subscription.subscribe((error, result) => {
      if (error) console.log(error)
    })
      .on('data', async (txHash) => {
        try {
          console.log('Transaction hash is: ' + txHash + '\n');
          // Instantiate web3 with HttpProvider
          this.openHttp();
          // Get transaction details
          const trx = await this.web3_http.eth.getTransaction(txHash);
          if (this.validateTransaction(trx)) {
            // Initiate transaction confirmation
            this.confirmEtherTransaction(txHash);
          }
          // Unsubscribe from pending transactions.
          subscription.unsubscribe();
        }
        catch (error) {
          console.log(error)
        }
      })
  }

  /**
   * ERC20 token 监听转账记录
   */
  watchTokenTransfers() {
    this.watch_type = 2;
    // Instantiate token contract object with JSON ABI and address
    const tokenContract = new this.web3.eth.Contract(this.token_abi, this.token_contract);
    // Generate filter options
    const options = {
      fromBlock: 'latest'
    };

    // Subscribe to Transfer events matching filter criteria
    tokenContract.events.Transfer(options)
      .on('data', async(event) => {
        console.log('监控到新的转账信息');
        console.log(event);
        const returnValues = event.returnValues;
        console.log(returnValues);
        // Instantiate web3 with HttpProvider
        this.openHttp();
        if (this.validateTransaction(returnValues)) {
          // Initiate transaction confirmation
          this.confirmEtherTransaction(event.transactionHash);
        }
      })
      .on('error', (error) => {
        console.log(error);
      });
  }

  async getConfirmations(txHash) {
    try {
      // Get transaction details
      const trx = await this.web3_http.eth.getTransaction(txHash);

      // Get current block number
      const currentBlock = await this.web3_http.eth.getBlockNumber();

      // When transaction is unconfirmed, its block number is null.
      // In this case we return 0 as number of confirmations
      return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber
    }
    catch (error) {
      console.log(error)
    }
  }

  confirmEtherTransaction(txHash, confirmations = 3) {

    setTimeout(async () => {
      // Get current number of confirmations and compare it with sought-for value
      const trxConfirmations = await this.getConfirmations(txHash);
      console.log('Transaction with hash ' + txHash + ' has ' + trxConfirmations + ' confirmation(s)');

      if (trxConfirmations >= confirmations) {
        // Handle confirmation event according to your business logic

        console.log('Transaction with hash ' + txHash + ' has been successfully confirmed');

        return true;
      }
      // Recursive call
      return this.confirmEtherTransaction(txHash, confirmations);
    }, 30 * 1000);
  }

  validateTransaction(trx) {
    let fromValid = true;
    let toValid = true;
    let amountValid = true;
    if (this.from_address) {
      fromValid = this.validateFromAddress(trx);
    }

    if (this.to_address) {
      toValid = this.validateToAddress(trx);
    }

    if (this.amount) {
      amountValid = this.validateAmount(trx);
    }

    return fromValid && toValid && amountValid;
  }

  /**
   * 验证from address
   * @param trx
   * @returns {boolean}
   */
  validateFromAddress(trx) {
    const fromAddress = this.from_address.map((address) => {
      return address.toLowerCase();
    });
    let from;
    if (this.watch_type === 1) {
      from = trx.from;
    } else {
      from = trx._from;
    }
    if (fromAddress.indexOf(from.toLowerCase()) >= 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 验证to address
   * @param trx
   * @returns {boolean}
   */
  validateToAddress(trx) {
    const toAddress = this.to_address.map((address) => {
      return address.toLowerCase();
    });
    let to;
    if (this.watch_type === 1) {
      to = trx.to;
    } else {
      to = trx._to;
    }
    if (toAddress.indexOf(to.toLowerCase()) >= 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 验证 Amount
   * @param trx
   * @returns {boolean | *}
   */
  validateAmount(trx) {
    const wei = 1000000000000000000;
    let value;
    if (this.watch_type === 1) {
      value = trx.value;
    } else {
      value = trx._value;
    }
    return new Decimal(this.amount).times(wei).equals(value);
  }
}

module.exports = TokenWatcher;