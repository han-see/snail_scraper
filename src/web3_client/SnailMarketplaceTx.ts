import { BigNumber, ethers, Transaction, Wallet } from 'ethers';
import { Account } from '../config/Account';
import { JsonRpcProvider } from '@ethersproject/providers';
import { AVAX_NODE } from '../config/RpcEndpoints';

export class SnailMarketplaceTx {
  private marketplaceContract = '0xeb77bd67Bd607e5b7d9b78db82fad0DE395B5DeF';
  private wallet: Wallet;
  private provider: JsonRpcProvider;

  constructor() {
    this.provider = new JsonRpcProvider(AVAX_NODE);
  }

  async buySnailFromMarketplace(marketId: string, snailPrice: string) {
    await Account.loadAccount()
      .then((res) => {
        this.wallet = res;
      })
      .catch((err) => console.error(err));

    const walletAddress = await this.wallet.getAddress();
    const walletNonce = await this.provider.getTransactionCount(walletAddress);
    const maxPriorityFeePerGas = await this.provider
      .getFeeData()
      .then((data) => data.maxPriorityFeePerGas);
    const hexMarketId = marketId;
    const hexData = this.createInputData(hexMarketId);

    const tx: Transaction = {
      from: walletAddress,
      to: this.marketplaceContract,
      nonce: walletNonce,
      // taken from contract tx.
      gasLimit: BigNumber.from('160000'),
      data: hexData,
      value: ethers.utils.parseEther(snailPrice),
      chainId: 43114,
      maxPriorityFeePerGas: maxPriorityFeePerGas,
    };

    const signer = await this.provider.getSigner();
    await signer
      .sendTransaction(tx)
      .then((transaction) => {
        console.log('Transaction successful');
        console.log(transaction);
      })
      .catch((err) => {
        console.log('Transaction is not successful', err);
      });
  }

  // Create a valid input data for the transaction
  createInputData(marketId: string) {
    const hexBuyFunction = '0x74fab4db';
    const hexMarketId = BigNumber.from(marketId).toHexString().slice(2);
    const inputHexLength = 74;
    const zeroAmount = inputHexLength - hexMarketId.length;
    const paddedHexBuyFunction = hexBuyFunction.padEnd(zeroAmount, '0');
    return paddedHexBuyFunction + hexMarketId;
  }
}

/* // Generic interaction with the crabada game contract. The hex data is the start or
        // end game data.
        // Gas is estimated from recent blocks, capped by a max value. If gas is too high,
        // the request will be skipped.
        sendCrabadaRequest: async function (hexData) {
          const account = web3.eth.accounts.privateKeyToAccount(deobfuscate(this.obfuscatedSecret));
          const recentGasPrice = await web3.eth.getGasPrice();
          const recentPriceOk = parseInt(recentGasPrice) < parseInt(this.maxGasPrice)
          if (!recentPriceOk) {
            sendWebhook("Gas prices too high, will try again later");
            return;
          } else {
            console.log("Gas price of " + recentGasPrice + " is less than max gas price " + this.maxGasPrice);
          }
          const unsignedTx = {
            from: account.address,
            gas: this.gasLimit,
            maxFeePerGas: recentGasPrice,
            to: this.gameContract,
            data: hexData,
            type: "0x02", // Crabada uses EIP-1559 tx.
          };

          console.log("signing tx");
          const signedTx = await web3.eth.accounts.signTransaction(unsignedTx, account.privateKey);

          try {
            console.log("sending tx");
            const sentTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log(sentTx);
            return sentTx;
          } catch (ex) {
            sendWebhook("failed to send tx: " + ex);
          } */
