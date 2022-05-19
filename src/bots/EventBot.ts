import { JsonRpcProvider } from '@ethersproject/providers';
import {
  AVAX_NODE,
  DEFAULT_MARKETPLACE_HEADER,
  MARKETPLACE_GQL_URL,
  SNAIL_MARKETPLACE_ABI,
  SNAIL_MARKETPLACE_CONTRACT,
  SNOWSIGHT_KEY,
  SNOWSIGHT_WS,
} from '../global/config';
import { SnailDetails } from '../types/SnailDetails';
import { QueryAllSnail, QuerySingleSnail } from '../web2_client/Query';
import { Account } from '../global/Account';
import 'dotenv/config';
import { SnailFloorPrice } from '../types/SnailFloorPrice';
<<<<<<< HEAD
import filterInput from '../../filterInput.json';
import {
  BlockEvent,
  ListingData,
  listingInMarketplace,
  parseListingDataFromMarketplace,
  priceUpdateInMarketplace,
=======
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import userInput from '../../userInput.json';
import {
  BlockEvent,
  ListingData,
  parseListingDataFromMarketplace,
>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c
} from '../types/MarketplaceEvent';
import { SnailMarketplaceTx } from '../web3_client/SnailMarketplaceTx';
import { Family } from '../types/Family';
import { Webhook } from '../web2_client/Webhook';
import { MempoolResponse } from '../types/MempoolResponse';
import WebSocket from 'ws';
import { BigNumber, Contract, ethers } from 'ethers';
import { formatEther, Interface } from 'ethers/lib/utils';
import * as Process from 'process';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser } from 'puppeteer';

<<<<<<< HEAD
/**
 * Get the minimum discount from the env file
 */
const minimumDiscount = Number(process.env.DISCOUNT);

/**
 * Get the maximum price in Avax that the bot allowed to buy
 */
const maxPrice = Number(process.env.MAXPRICE);

/**
 * Pause interval when querying data from the marketplace API
 */
const pauseInterval = 500;

/**
 * This is the main bot class
 */
=======
const minimumDiscount = Number(process.env.DISCOUNT);

const maxPrice = Number(process.env.MAXPRICE);

const marketplaceUpdatePriceTopics =
  '0x84e7202ffb140dbeb09920388f40e357a1211b905a1a82b54f213e64942f9daf';

const marketplaceListSnailTopics =
  '0x8b5ebb2dc6de3438616ab5b99285b16a20fb015b845f3458d7215ec10de2c40f';

const listingInMarketplace = {
  address: SNAIL_MARKETPLACE_CONTRACT,
  topics: [marketplaceListSnailTopics],
};

const priceUpdateInMarketplace = {
  address: SNAIL_MARKETPLACE_CONTRACT,
  topics: [marketplaceUpdatePriceTopics],
};

const pauseInterval = 500;

>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c
export class EventBot {
  private provider: JsonRpcProvider;
  private account: Account;
  private snailFloorPrice: SnailFloorPrice;
  private snailMarketplaceTx: SnailMarketplaceTx;
  private latestMarketId: number;
  private browser: Browser;

  constructor(account: Account) {
    this.provider = new JsonRpcProvider(AVAX_NODE);
    this.account = account;
    this.snailMarketplaceTx = new SnailMarketplaceTx(account);
  }

  /*
   * For Now this method is only to listen to the update price event that's being broadcasted from the node
<<<<<<< HEAD
   * In the future the update price event can also be optimized by listening directly to the mempool
   */
=======
   * In the future the update price event can also be optimized by listening directly to the mempool*/
>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c
  private async listenToListingUpdatePriceEvent() {
    console.log(await this.provider.getNetwork());
    console.log(
      `Looking for at least ${minimumDiscount * 100}% discount from market`,
    );
    console.log(`Maximum buying price is ${process.env.MAXPRICE} AVAX`);
    try {
<<<<<<< HEAD
=======
      /*console.log('Listening to the listing event');
      this.provider.on(listingInMarketplace, (log: BlockEvent) => {
        this.checkFloorPrice();
        const data = parseListingDataFromMarketplace(log.data);
        this.checkEvent(data);
      });*/
>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c
      console.log('Listening to the update price event');
      this.provider.on(priceUpdateInMarketplace, (log: BlockEvent) => {
        this.checkFloorPrice();
        const data = parseListingDataFromMarketplace(log.data);
        this.checkEvent(data);
      });
    } catch (err) {
      console.error(err);
    }
  }

<<<<<<< HEAD
  /**
   * This method is use to initiate the first ws connection to the mempool and listening to the mempool update
   */
=======
>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c
  private async listenToListingEventInMempool() {
    if (this.account.wallet == undefined) {
      await this.account.loadAccount();
    }
    const signed_key = await this.account.wallet.signMessage(SNOWSIGHT_KEY);

    const message = JSON.stringify({
      signed_key: signed_key,
      include_finalized: true,
    });

    const ws = new WebSocket(SNOWSIGHT_WS);

    ws.on('open', () => {
      ws.send(message);
    });

    console.log('Listening to sell listing event');

    ws.on('message', (data) => {
      this.checkMempoolResponseForSaleEvent(data);
    });
  }

<<<<<<< HEAD
  /**
   * This method is used to check if the event from the mempool is related
   * to the snail marketplace and a sale event (snail listing event)
   * @param data
   */
=======
>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c
  private checkMempoolResponseForSaleEvent(data) {
    const sellFunction = '2796390c';
    const mempoolResponse: MempoolResponse = JSON.parse(data.toString());
    if (
      mempoolResponse.to === SNAIL_MARKETPLACE_CONTRACT.toLowerCase() &&
      mempoolResponse.blockNumber === '0x0'
    ) {
      console.log(new Date().toUTCString());
      console.log(mempoolResponse);
      if (mempoolResponse.input.slice(2, 10) === sellFunction) {
        this.latestMarketId++;
        const snailIdInHex = ethers.utils.hexStripZeros(
          '0x' + mempoolResponse.input.slice(11, 74),
        );
        const snailId = BigNumber.from(snailIdInHex).toNumber();
        const sellPriceInHex = ethers.utils.hexStripZeros(
          '0x' + mempoolResponse.input.slice(75, 138),
        );
        const sellPrice = formatEther(
          BigNumber.from(sellPriceInHex).toString(),
        );
        const data = {
          snailMarketId: BigNumber.from(this.latestMarketId),
          snailId: snailId,
          sellPrice: sellPrice,
        };
        this.checkEvent(data);
      }
    }
  }

  /**
   * The listing / update price event will be check here. If the event fulfilled the current requirements
   * the snail will be bought from the marketplace and the user will be ping if the buy is successful
   * The discount and the maximum price will be read from the .env files
   * @param data
   */
  private checkEvent(data: ListingData) {
    console.time('checkEvent');
    console.log(new Date().toUTCString(), `Checking Snail ${data.snailId}`);
    this.getSnailDetail(data.snailId).then((res) => {
      const snailDetail = res;
      const snailPrice = Number(data.sellPrice);
      const snailFamily = res.data.snail_promise.family;
      const floorPrice = this.snailFloorPrice[Family[snailFamily]];
      const discountPrice = floorPrice * (1 - minimumDiscount);
      console.log('Snail listing price:', snailPrice);
      console.log('Snail floor price:', floorPrice);
      console.log('Discount price:', discountPrice);

      if (snailPrice <= discountPrice && snailPrice <= maxPrice) {
        console.time('buyEvent');
        console.log(
          new Date().toUTCString(),
          `Trying to buy snail ${data.snailId}`,
        );
        console.log('Floor', this.snailFloorPrice);
        this.sendBuyEventToUser(snailDetail, data, floorPrice);
        this.snailMarketplaceTx
          .buySnailFromMarketplace(
            data.snailMarketId.toString(),
            data.sellPrice,
          )
          .then((res) => {
            if (res !== undefined) {
              res
                .wait()
                .then((data) => {
                  this.sendSuccessfulTx(
                    snailDetail,
                    JSON.stringify(data),
                    floorPrice,
                  );
                })
                .catch((err) => {
                  console.log(err);
                  this.sendFailedTx(
                    snailDetail,
                    JSON.stringify(err),
                    floorPrice,
                  );
                });
            }
          })
          .catch((err) => {
            console.log(err);
            this.sendFailedTx(snailDetail, JSON.stringify(err), floorPrice);
          });
        console.timeEnd('buyEvent');
      } else {
        console.log(new Date().toUTCString());
        console.log(
          `Snail ${data.snailId} cost ${snailPrice} AVAX is higher than the max discounted Price ${discountPrice} AVAX`,
        );
      }
    });
    console.timeEnd('checkEvent');
  }

  private sendBuyEventToUser(
    snailDetail: SnailDetails,
    listingData: ListingData,
    floorPrice: number,
  ) {
    const data = snailDetail.data.snail_promise;
    const webhook = new Webhook(
      `Buying Snail - ${data.id}`,
      `Snail ${data.id} (${data.family} - Gen: ${data.generation} - ${data.purity}/20) SOLD for **${listingData.sellPrice} AVAX**`,
      `https://www.snailtrail.art/snails/${data.id}/snail`,
      data.image,
    );
    webhook.sendMessageToUser(floorPrice);
  }

  private sendFailedTx(
    snailDetail: SnailDetails,
    info: string,
    floorPrice: number,
  ) {
    const data = snailDetail.data.snail_promise;
    const webhook = new Webhook(
      `Failed to buy Snail - ${data.id}`,
      `${info}`,
      `https://www.snailtrail.art/snails/${data.id}/snail`,
      data.image,
    );
    webhook.sendMessageToUser(floorPrice);
  }

  private sendSuccessfulTx(
    snailDetail: SnailDetails,
    info: string,
    floorPrice: number,
  ) {
    const data = snailDetail.data.snail_promise;
    const webhook = new Webhook(
      `Successful to buy Snail - ${data.id}`,
      `${info}`,
      `https://www.snailtrail.art/snails/${data.id}/snail`,
      data.image,
    );
    webhook.sendMessageToUser(floorPrice);
  }

  /**
   * Function to query the detail of the snails using the snail marketplace api
   * @param snailId
   * @returns
   */

  private async getSnailDetail(snailId: number): Promise<SnailDetails> {
    console.time('checkSnailDetail');
    const query = new QuerySingleSnail(snailId);

    const overrideParam = {
      method: 'POST',
      headers: DEFAULT_MARKETPLACE_HEADER.headers,
      postData: JSON.stringify(query),
    };

    try {
      const response = await this.queryDataFromMarketplaceAPI(overrideParam);
      console.timeEnd('checkSnailDetail');
      return response;
    } catch (err) {
      console.error('Error fetching single snail', err);
    }
    console.timeEnd('checkSnailDetail');
    return null;
  }

  /**
   * Function to check the floor price and save it as JSON in the root files.
   * This function is important otherwise the bot doesn't know how cheap the current snails are.
   */
  private async checkFloorPrice() {
    console.time('checkFp');
    const content = {} as SnailFloorPrice;

<<<<<<< HEAD
    for (let i = 0; i < filterInput.length; i++) {
      const query = new QueryAllSnail(filterInput[i].filter);
=======
    for (let i = 0; i < userInput.length; i++) {
      const query = new QueryAllSnail(userInput[i].filter);
>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c

      const overrideParam = {
        method: 'POST',
        headers: DEFAULT_MARKETPLACE_HEADER.headers,
        postData: JSON.stringify(query),
      };

      try {
        const res = await this.queryDataFromMarketplaceAPI(overrideParam);
<<<<<<< HEAD
        const family = filterInput[i].filter.family;
=======
        const family = userInput[i].filter.family;
>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c
        content[family] = res.data.marketplace_promise.snails[0].market.price;
        await new Promise((resolve) => setTimeout(resolve, pauseInterval));
      } catch (err) {
        console.error('Error during checking floor price', err);
      }
    }
    console.log(content);
    this.snailFloorPrice = content;
    console.timeEnd('checkFp');
  }

<<<<<<< HEAD
  /**
   * Function to refresh the floor price every 5 minutes to avoid cloudflare restrictions
   */
=======
>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c
  private async refreshFloorPrice() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('Running the refresh loop');
      await new Promise((resolve) => setTimeout(resolve, 300000));
      await this.checkFloorPrice();
    }
  }

  private async queryDataFromMarketplaceAPI(overrideParam) {
    const page = await this.browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (interceptRequest) => {
      interceptRequest.continue(overrideParam);
    });
    const response = await page.goto(MARKETPLACE_GQL_URL);
    const responseBody = JSON.parse(await response.text());
    await page.close();
    console.log(`Querying data from API status ${response.status()}`);
    return responseBody;
  }

<<<<<<< HEAD
  /**
   * This method is used to check what is the latest market id. To be able to buy the snail, it needs a market Id as a parameter.
   * The market id is generated only after the transaction is mined.
   * @returns
   */
=======
>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c
  private async findLatestMarketId() {
    const marketplaceContract = new Contract(
      SNAIL_MARKETPLACE_CONTRACT,
      new Interface(SNAIL_MARKETPLACE_ABI),
      this.provider,
    );
    let currentBlock = await this.provider.getBlockNumber();
    let isLatestMarketIdFound = false;
    while (!isLatestMarketIdFound) {
      console.log(`Checking the latest market ID from block ${currentBlock}`);
      // max query set data is 2048 (avax node)
      // max query set data is 2000 (moralis node)
      const getSaleEvent = await marketplaceContract.queryFilter(
        listingInMarketplace,
        currentBlock - 2000,
        currentBlock,
      );
      console.log(getSaleEvent);
      if (getSaleEvent.length == 0) {
        currentBlock -= 2000;
      } else {
        isLatestMarketIdFound = true;
        const marketIdInHex = ethers.utils.hexStripZeros(
          getSaleEvent.at(-1).data.slice(0, 66),
        );
        return BigNumber.from(marketIdInHex).toNumber();
      }
    }
    return null;
  }

<<<<<<< HEAD
  /**
   * Create the browser instance to query data from the API using puppeteer to avoid cloudflare.
   */
=======
>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c
  private async createBrowserInstance() {
    this.browser = await puppeteer
      .use(StealthPlugin())
      .launch({ headless: true, args: ['--no-sandbox'] });
  }

  /**
   * Initiate and start the bot
   */
  async startBot() {
    await this.createBrowserInstance();
    await this.checkFloorPrice();
    this.latestMarketId = await this.findLatestMarketId();
    console.log(`Latest market id is ${this.latestMarketId}`);
    if (this.latestMarketId === null || undefined) {
      console.error('No market id found');
      //TODO Ping to discord if there's an error on the app
      Process.exit(1);
    }
    this.refreshFloorPrice();
    this.listenToListingUpdatePriceEvent();
    this.listenToListingEventInMempool();
  }
}
