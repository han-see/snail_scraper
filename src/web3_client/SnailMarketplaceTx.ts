import { BigNumber, ethers, Transaction, Wallet } from 'ethers';
import { Account } from '../global/Account';
import { JsonRpcProvider } from '@ethersproject/providers';
import {AVAX_NODE, SNAIL_MARKETPLACE_CONTRACT} from '../global/config';
import { TransactionResponse } from '@ethersproject/abstract-provider';

export class SnailMarketplaceTx {
  private wallet: Wallet;
  private walletAddress: string;
  private provider: JsonRpcProvider;

  constructor(account: Account) {
    this.provider = new JsonRpcProvider(AVAX_NODE);
    this.wallet = account.wallet;
    this.walletAddress = account.walletAddress;
  }

  async buySnailFromMarketplace(
    marketId: string,
    snailPrice: string,
  ): Promise<TransactionResponse> {
    const walletNonce = await this.provider.getTransactionCount(
      this.walletAddress,
    );
    const feeData = await this.provider.getFeeData();
    const hexMarketId = marketId;
    const hexData = this.createInputData(hexMarketId);
    let txResponse;

    const unSignedTx: Transaction = {
      from: this.walletAddress,
      to: SNAIL_MARKETPLACE_CONTRACT,
      nonce: walletNonce,
      // gasLimit taken from the recent contract call from snowtrace.
      gasLimit: BigNumber.from(160000),
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      data: hexData,
      value: ethers.utils.parseEther(snailPrice),
      chainId: 43114,
      type: 2,
    };

    const signedTx = await this.wallet.signTransaction(unSignedTx);

    await this.provider
      .sendTransaction(signedTx)
      .then((transaction) => {
        console.log('Transaction successful');
        console.log(transaction);
        txResponse = transaction;
      })
      .catch((err) => {
        throw err;
      });

    return txResponse;
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
