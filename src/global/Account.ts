import PromptSync from 'prompt-sync';
import * as fs from 'fs';
import { Wallet } from 'ethers';
import 'dotenv/config';
import WebSocket from 'ws';
import { AVAX_NODE, SNOWSIGHT_WS } from './config';
import { JsonRpcProvider } from '@ethersproject/providers';
import { MempoolResponse } from '../types/MempoolResponse';
import { SNAIL_MARKETPLACE_CONTRACT } from './addresses';
import { timeStamp } from 'console';

export class Account {
  private _walletAddress: string;
  private _wallet: Wallet;

  async loadAccount() {
    const password = process.env.PASSWORD;
    try {
      const credentials = fs.readFileSync('credentials.json').toString();
      const wallet = Wallet.fromEncryptedJsonSync(credentials, password);
      console.log(`Account ${await wallet.getAddress()} is loaded`);
      this._wallet = wallet;
      this._walletAddress = await wallet.getAddress();
    } catch (err) {
      console.error('Account cannot be loaded', err);
    }
  }

  async connectToSnowsight() {
    if (this.wallet == undefined) {
      this.loadAccount();
    }
    const key = 'Sign this message to authenticate your wallet with Snowsight.';
    const signed_key = await this.wallet.signMessage(key);

    const message = JSON.stringify({ signed_key: signed_key });

    const ws = new WebSocket(SNOWSIGHT_WS);

    const provider = new JsonRpcProvider(AVAX_NODE);

    ws.on('open', () => {
      ws.send(message);
    });

    ws.on('message', (data) => {
      //provider.getBlockNumber().then((block) => console.log(block));
      //console.log(`received: ${data}`);
      const mempoolResponse: MempoolResponse = JSON.parse(data.toString());
      // console.log(mempoolResponse)
      if (mempoolResponse.to == SNAIL_MARKETPLACE_CONTRACT.toLowerCase()) {
        console.log(Date.now());
        console.log(mempoolResponse);
      }
    });
  }

  static makeNewAccount() {
    try {
      const prompt = PromptSync();
      const password = prompt('Enter your password: ');
      console.log(password);
      const privateKey = '0x' + prompt('Enter your private key: ');
      console.log(privateKey);
      const wallet = new Wallet(privateKey);
      wallet.encrypt(password).then((file) => {
        fs.writeFileSync('credentials.json', file);
        fs.appendFileSync('.env', `PASSWORD=${password}`);
        console.log('Account created successfully');
      });
    } catch (err) {
      console.error('Account creation is not successful', err);
    }
  }

  public get walletAddress() {
    return this._walletAddress;
  }

  public get wallet() {
    return this._wallet;
  }
}
