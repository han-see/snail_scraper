/*     These two functions are a really simple way to hide/unhide a string.
    The goal is not to be cryptographically secure, just to manufacture a simple
    reversable operation that won't resemble a private key.
    Even if there's some kind of malware running on the machine, this should
    be enough to keep things safe.
 */

import PromptSync from 'prompt-sync';
import * as fs from 'fs';
import { Wallet } from 'ethers';
import 'dotenv/config';
import { JsonRpcProvider } from '@ethersproject/providers';
import { MORALIS } from '../web3_client/RpcEndpoints';

export class Account {
  static async loadAccount() {
    const password = process.env.PASSWORD;
    //const providerAPI = MORALIS;
    //const provider = new JsonRpcProvider(providerAPI);
    try {
      const credentials = fs.readFileSync('credentials.json').toString();
      const account = Wallet.fromEncryptedJsonSync(credentials, password);
      console.log(`Account ${await account.getAddress()} is loaded`);
      return account;
    } catch (err) {
      console.error('Account cannot be loaded', err);
    }
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
}
