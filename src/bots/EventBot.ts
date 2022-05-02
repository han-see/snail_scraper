import { JsonRpcProvider } from '@ethersproject/providers';
import {
  AVAX_NODE,
  DEFAULT_MARKETPLACE_HEADER,
  MARKETPLACE_GQL_URL,
} from '../global/config';
import { SnailDetails } from '../types/SnailDetails';
import axios from 'axios';
import { QueryAllSnail, QuerySingleSnail } from '../web2_client/Query';
import { SNAIL_MARKETPLACE_CONTRACT } from '../global/addresses';
import { Account } from '../global/Account';
import 'dotenv/config';
import { SnailFloorPrice } from '../types/SnailFloorPrice';
import * as fs from 'fs';
import userInput from '../../userInput.json';
import {
  BlockEvent,
  ListingData,
  parseListingDataFromMarketplace,
} from '../types/MarketplaceEvent';
import { SnailMarketplaceTx } from '../web3_client/SnailMarketplaceTx';
import { Family } from '../types/Family';
import { Marketplace } from '../types/MarketplaceResponse';
import { Webhook } from '../web2_client/Webhook';

const minimumDiscount = parseFloat(process.env.DISCOUNT);

const maxPrice = parseFloat(process.env.MAXPRICE);

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

export class EventBot {
  private provider: JsonRpcProvider;
  private account: Account;
  private snailFloorPrice: SnailFloorPrice;
  private snailMarketplaceTx: SnailMarketplaceTx;

  constructor(account: Account) {
    this.provider = new JsonRpcProvider(AVAX_NODE);
    this.account = account;
    this.snailMarketplaceTx = new SnailMarketplaceTx(account);
  }

  async listenToListingEvent() {
    console.log(await this.provider.getNetwork());
    console.log(
      `Looking for at least ${minimumDiscount * 100}% discount from market`,
    );
    console.log(`Maximum buying price is ${process.env.MAXPRICE} AVAX`);
    try {
      console.log('Listening to the listing event');
      this.provider.on(listingInMarketplace, (log: BlockEvent) => {
        const data = parseListingDataFromMarketplace(log.data);
        this.checkEvent(data);
      });
      console.log('Listening to the update price event');
      this.provider.on(priceUpdateInMarketplace, (log: BlockEvent) => {
        const data = parseListingDataFromMarketplace(log.data);
        this.checkEvent(data);
      });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * The listing / update price event will be check here. If the event fulfilled the current requirements
   * the snail will be bought from the marketplace and the user will be ping if the buy is successful
   * The discount and the maximum price will be read from the .env files
   * @param data
   */
  checkEvent(data: ListingData) {
    console.log(`Checking Snail ${data.snailId}`);
    this.getSnailDetail(data.snailId).then((res) => {
      const snailDetail = res;
      const snailPrice = parseInt(data.sellPrice);
      const snailFamily = res.data.snail_promise.family;
      const floorPrice = this.snailFloorPrice[Family[snailFamily]];
      const discountPrice = floorPrice * (1 - minimumDiscount);

      if (snailPrice <= discountPrice && snailPrice <= maxPrice) {
        console.log(`Trying to buy snail ${data.snailId}`);
        this.sendBuyEventToUser(snailDetail, data, floorPrice);
        this.snailMarketplaceTx
          .buySnailFromMarketplace(
            data.snailMarketId.toString(),
            data.sellPrice,
          )
          .then((res) => {
            if (res !== undefined) {
              res.wait().then((data) => {
                this.sendSuccessfulTx(
                  snailDetail,
                  JSON.stringify(data),
                  floorPrice,
                );
              });
            }
          })
          .catch((err) => {
            console.log(err);
            this.sendFailedTx(snailDetail, JSON.stringify(err), floorPrice);
          });
        this.checkFloorPrice();
      } else {
        console.log(new Date().toUTCString());
        console.log(
          `Snail ${data.snailId} cost ${snailPrice} AVAX is higher than the max discounted Price ${discountPrice} AVAX`,
        );
      }
    });
  }

  sendBuyEventToUser(
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

  sendFailedTx(snailDetail: SnailDetails, info: string, floorPrice: number) {
    const data = snailDetail.data.snail_promise;
    const webhook = new Webhook(
      `Failed to buy Snail - ${data.id}`,
      `${info}`,
      `https://www.snailtrail.art/snails/${data.id}/snail`,
      data.image,
    );
    webhook.sendMessageToUser(floorPrice);
  }

  sendSuccessfulTx(
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

  async getSnailDetail(snailId: number): Promise<SnailDetails> {
    try {
      const res = await axios.post<SnailDetails>(
        MARKETPLACE_GQL_URL,
        new QuerySingleSnail(snailId),
        DEFAULT_MARKETPLACE_HEADER,
      );
      console.log('Checking Snail Detail:', res.status);
      return res.data;
    } catch (err) {
      console.error('Error fetching single snail', err);
    }
    return null;
  }

  /**
   * Function to check the floor price and save it as JSON in the root files.
   * This function is important otherwise the bot doesn't know how cheap the current snails are.
   */
  async checkFloorPrice() {
    const content = {} as SnailFloorPrice;

    for (let i = 0; i < userInput.length; i++) {
      try {
        const res = await axios.post<Marketplace>(
          MARKETPLACE_GQL_URL,
          new QueryAllSnail(userInput[i].filter),
          DEFAULT_MARKETPLACE_HEADER,
        );
        console.log('Checking the floor price: ', res.status);
        const family = userInput[i].filter.family;
        content[family] =
          res.data.data.marketplace_promise.snails[0].market.price;
      } catch (err) {
        console.error('Error during checking floor price', err);
      }
    }
    console.log(content);
    fs.writeFileSync('./floorPrice.json', JSON.stringify(content));
    this.refreshFloorPrice();
  }

  refreshFloorPrice() {
    this.snailFloorPrice = JSON.parse(
      fs.readFileSync('./floorPrice.json').toString(),
    );
  }

  /**
   * Initiate and start the bot
   */
  async startBot() {
    await this.checkFloorPrice();
    this.listenToListingEvent();
  }
}
