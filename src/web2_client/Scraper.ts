import axios from 'axios';
import { Marketplace, Snail } from '../common/MarketplaceResponse';
import * as fs from 'fs';
import 'dotenv/config';
import { IQueryFilter, QueryAllSnail } from './Query';
import { Webhook } from '../common/Webhook';
import { UserInput } from '../common/UserInput';

const URL = 'https://api.snailtrail.art/graphql/';

const config = {
  headers: {
    authority: 'api.snailtrail.art',
    method: 'POST',
    path: '/graphql/',
    scheme: 'https',
    accept: 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en,en-US;q=0.9,de;q=0.8,id;q=0.7',
    'content-type': 'application/json',
    origin: 'https://www.snailtrail.art',
    referer: 'https://www.snailtrail.art/',
    'sec-ch-ua':
      '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent':
      'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36',
  },
};

export class Scraper {
  private queryFilter: IQueryFilter;

  private queryAllSnail;

  private pingedSnail: number[] = [];

  private discount: number;

  private maxPrice: number;

  constructor(userInput: UserInput) {
    this.queryFilter = userInput.filter;
    this.discount = userInput.discount;
    this.maxPrice = userInput.maxPrice;
    this.queryAllSnail = new QueryAllSnail(this.queryFilter, 20);
  }

  async scrapeMarketplace() {
    try {
      const res = await axios.post<Marketplace>(
        URL,
        this.queryAllSnail,
        config,
      );
      const data = JSON.stringify(res.data);
      await fs.writeFileSync('response.json', data);
      console.log(`Status: ${res.status}`);
      console.log(`Discount: ${this.discount}`);
      console.log(`Price: ${this.maxPrice}`);
      console.log(`Filter: ${JSON.stringify(this.queryFilter)}`);
      console.log('-----------------');
      this.checkMarketPlacePrice(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  checkMarketPlacePrice(data: Marketplace) {
    const snailData: Snail[] = data.data.marketplace_promise.snails;
    const discount = this.discount;
    const maxAvaxPrice = this.maxPrice;

    if (snailData.length > 1) {
      if (
        snailData[0].market.price <=
          snailData[1].market.price * (1 - discount) &&
        snailData[0].market.on_sale
      ) {
        this.pingUserForDiscount(snailData[0]);
      }
    }
    if (snailData[0].market.price <= maxAvaxPrice) {
      this.pingUserForDiscount(snailData[0]);
    }
  }

  pingUserForDiscount(snail: Snail) {
    if (!this.pingedSnail.includes(snail.id)) {
      const webhook = new Webhook(
        `${snail.name} is on sale for ${snail.market.price} AVAX`,
        `Adaptations: ${snail.adaptations}`,
        `https://www.snailtrail.art/snails/${snail.id}/snail`,
        snail.image,
      );
      webhook.sendMessage();
      this.pingedSnail.push(snail.id);
    }
  }
}
