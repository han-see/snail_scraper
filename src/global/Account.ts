import PromptSync from 'prompt-sync';
import * as fs from 'fs';
import { Wallet } from 'ethers';
import 'dotenv/config';

<<<<<<< HEAD
/**
 * This is a class to generate an account using private key provided by the user and loading an account from the encrypted json file
 */
=======
>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c
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
