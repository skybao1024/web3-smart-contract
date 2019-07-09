const Web3 = require('web3');
const Transaction = require('ethereumjs-tx');

class TokenHandle {

  constructor() {
    //连接INFURA
    this.web3 = new Web3(process.env.INFURA_URL);

    this.token_decimals = 8;

    this.transfer_method = 'transfer';
  }

  /**
   * Set up the contract ABI
   * @param name
   */
  setAbi(name) {
    this.token_abi = require('../resource/abi/'+name);
    return this;
  }

  /**
   * Set up the contract decimal
   * @param num
   */
  setDecimal(num) {
    this.token_decimals = num;
    return this;
  }

  /**
   * Set up the wallet
   * @param name
   * @returns {TokenHandle}
   */
  setWallet(name) {
    this.token_wallet = name;
    return this;
  }

  /**
   * Set up the wallet key
   * @param key
   * @returns {TokenHandle}
   */
  setWalletKey(key) {
    this.privateKey = Buffer.from(key, 'hex');
    return this;
  }

  /**
   * Set the contract address to use
   * @param contract
   * @returns {TokenHandle}
   */
  setContract(contract) {
    this.token_contract = contract;
    return this;
  }

  /**
   * Set up the Gwei
   * @param num
   * @returns {TokenHandle}
   */
  setGwei(num) {
    let gwei = num;
    if (num > 20) {
      gwei = 20;
    }
    this.gwei = gwei;
    return this;
  }

  /**
   * Set up the contract transfer method
   * @param method
   * @returns {TokenHandle}
   */
  setTransferMethod(method) {
    this.transfer_method = method;
    return this;
  }

  /**
   * Balance at the specified address
   * @param address
   * @returns {Promise<void>}
   */
  async balanceOf(address) {
    const contract = new this.web3.eth.Contract(this.token_abi, this.token_contract);
    const balance = await contract.methods.balanceOf(address).call();
    return balance;
  }

  /**
   * Smart contract transfer
   * @param address
   * @param amount
   * @returns {Promise<void>}
   */
  async transfer(address, amount) {
    const ethBalance = await this.web3.eth.getBalance(this.token_wallet);
    console.log(`Balance ETH: ${ethBalance} \n`);
    if (ethBalance === 0) {
      return false;
    }
    const contract = new this.web3.eth.Contract(this.token_abi, this.token_contract, { from: this.token_wallet, });

    const decimal = this.token_decimals;
    console.log(`Decimal is: ${decimal} \n`);

    const txCount = await this.web3.eth.getTransactionCount(this.token_wallet);
    const num = amount * (10 ** decimal);
    const amountNum = this.web3.utils.toHex(num);
    const gasPrice = this.gwei * 1e9;
    const gasLimit = 210000;
    const txParams = {
      from: this.token_wallet,
      nonce: this.web3.utils.toHex(txCount),
      gasPrice: this.web3.utils.toHex(gasPrice), // gwei
      gasLimit: this.web3.utils.toHex(gasLimit),
      to: this.token_contract,
      value: this.web3.utils.toHex(0),
      data: contract.methods[this.transfer_method](address, amountNum).encodeABI(),
      chainId: parseInt(process.env.CHAIN_ID),
    };
    const tx = new Transaction(txParams);
    tx.sign(this.privateKey);

    const confirmation = await this.confirmation(tx);
    return confirmation;
  }

  /**
   * Smart contract bulk transfer
   * @param address
   * @param amount
   * @returns {Promise<*>}
   */
  async massTransfer(address, amount) {
    const ethBalance = await this.web3.eth.getBalance(this.token_wallet);
    console.log(`Balance ETH: ${ethBalance} \n`);
    if (ethBalance === 0) {
      return false;
    }
    const contract = new this.web3.eth.Contract(this.token_abi, this.token_contract, { from: this.token_wallet, });

    const addressCount = address.length;

    const decimal = this.token_decimals;
    console.log(`Decimal is: ${decimal} \n`);

    const txCount = await this.web3.eth.getTransactionCount(this.token_wallet);
    const amountList = amount.map((num) => {
      const amountNum = Math.ceil(num * (10 ** decimal));
      return this.web3.utils.toHex(amountNum);
    });
    let gasLimit = 35000 * addressCount;
    if (gasLimit < 210000) {
      gasLimit = 210000;
    }
    const gasPrice = this.gwei * 1e9;
    const txParams = {
      from: this.token_wallet,
      nonce: this.web3.utils.toHex(txCount),
      gasPrice: this.web3.utils.toHex(gasPrice),
      gasLimit: this.web3.utils.toHex(gasLimit),
      to: this.token_contract,
      value: this.web3.utils.toHex(0),
      data: contract.methods[this.transfer_method](address, amountList).encodeABI(), // 自定义合约批量打币方法
      chainId: parseInt(process.env.CHAIN_ID),
    };
    console.log(`txParams is: ${txParams} \n`);
    const tx = new Transaction(txParams);
    tx.sign(this.privateKey);
    const confirmation = await this.confirmation(tx);
    return confirmation;
  }

  /**
   * Transfer confirmation
   * @param tx
   * @returns {Promise<void>}
   */
  async confirmation(tx) {
    const confirmation = await new Promise((resolve) => {
      this.web3.eth.sendSignedTransaction(`0x${tx.serialize().toString('hex')}`)
        .on('transactionHash', async (hash) => {
          console.log(`the pending transaction hash is: ${hash}`);
        })
        .on('confirmation', async (confirmationNumber) => {
          console.log(`confirmation up to : ${confirmationNumber}`);
          if (confirmationNumber >= 3) {
            console.log('confirmationed success');
            return resolve(true);
          }
          return false;
        })
        .on('error', (e) => {
          console.log(e);
          return resolve(false);
        });
    });
    return confirmation;
  }

}

module.exports = TokenHandle;