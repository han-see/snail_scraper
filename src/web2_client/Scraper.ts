import axios from 'axios';
import { Marketplace, Snail } from '../types/MarketplaceResponse';
import * as fs from 'fs';
import 'dotenv/config';
import { IQueryFilter, QueryAllSnail, QuerySingleSnail } from './Query';
import { Webhook } from '../common/Webhook';
import { UserInput } from '../types/UserInput';
import { SnailDetails } from '../types/SnailDetails';

const URL = 'https://api.snailtrail.art/graphql/';

const DEFAULT_HEADER = {
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
        DEFAULT_HEADER,
      );
      const data = JSON.stringify(res.data);
      fs.writeFileSync('response.json', data);
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
        this.pingUserForDiscount(snailData[0], snailData[1].market.price);
      } else if (snailData[0].market.price <= maxAvaxPrice) {
        this.pingUserForDiscount(snailData[0], snailData[1].market.price);
      }
    }
  }

  async pingUserForDiscount(snail: Snail, nextSnailPrice?: number) {
    if (!this.pingedSnail.includes(snail.id)) {
      const snailDetail = await this.getSnailDetail(snail);
      const formattedData = this.formatSnailDetail(snailDetail);
      if (snailDetail) {
        const snailDataDetail = snailDetail.data.snail_promise;
        const webhook = new Webhook(
          `${snailDataDetail.id} (${snailDataDetail.family}) is on sale for ${snail.market.price} AVAX`,
          formattedData,
          `https://www.snailtrail.art/snails/${snail.id}/snail`,
          snail.image,
          nextSnailPrice,
        );
        webhook.sendMessage();
        this.pingedSnail.push(snail.id);
      }
    }
  }

  async getSnailDetail(snail: Snail) {
    try {
      const res = await axios.post<SnailDetails>(
        URL,
        new QuerySingleSnail(snail.id),
        DEFAULT_HEADER,
      );
      console.log(res.status);
      return res.data;
    } catch (err) {
      console.error('Error fetching single snail', err);
    }
    return null;
  }

  formatSnailDetail(snailDetail: SnailDetails): string {
    if (snailDetail == null) {
      return '';
    }
    const data = snailDetail.data.snail_promise;
    const str = `Family: ${data.family}
    \nKlass: ${data.klass}
    \nGeneration: ${data.generation}
    \nPurity: ${data.purity}
    \nGender: ${data.gender.value}
    \nAdaptations: ${data.adaptations}
    \nGene: ${data.genome}
    \nLast Sale: ${data.market.last_sale} AVAX
    \nHighest Sale: ${data.market.highest_sale} AVAX
    \nStats:
    Level: ${data.stats.experience.level}
    Win Ratio: ${data.stats.win_ratio}
    Top Three Ratio: ${data.stats.top_three_ratio}
    Races: ${data.stats.races}
    Elo: ${data.stats.elo}
    Earned Avax: ${data.stats.earned_avax}
    Earned Token: ${data.stats.earned_token}`;
    return '```' + str + '```';
  }
}
