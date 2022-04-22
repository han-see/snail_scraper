import axios from 'axios';
import { Marketplace, Snail } from '../common/MarketplaceResponse';
import * as fs from 'fs';
import 'dotenv/config';
import { Adaptations, Family } from '../common/Family';
import { QueryAllSnail, QueryFilter } from './Query';
import { Webhook } from '../common/Webhook';

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

const queryFilter: QueryFilter = {};

const queryAllSnail = new QueryAllSnail(queryFilter, 20);

const pingedSnail: number[] = [];

export async function scrapeMarketplace() {
  try {
    const res = await axios.post<Marketplace>(URL, queryAllSnail, config);
    const data = JSON.stringify(res.data);
    await fs.writeFileSync('response.json', data);
    console.log(`Status: ${res.status}`);
    checkMarketPlacePrice(res.data);
  } catch (err) {
    console.error(err);
  }
}

function checkMarketPlacePrice(data: Marketplace) {
  const snailData: Snail[] = data.data.marketplace_promise.snails;
  const discount = parseInt(process.env.SNAIL_DISCOUNT);
  const maxAvaxPrice = parseInt(process.env.SNAIL_MAX_PRICE);

  if (snailData.length > 1) {
    if (
      snailData[0].market.price <= snailData[1].market.price * (1 - discount) &&
      snailData[0].market.on_sale
    ) {
      pingUserForDiscount(snailData[0]);
    }
  }
  if (snailData[0].market.price <= maxAvaxPrice) {
    pingUserForDiscount(snailData[0]);
  }
}

function pingUserForDiscount(snail: Snail) {
  if (!pingedSnail.includes(snail.id)) {
    const webhook = new Webhook(
      `${snail.name} is on sale for ${snail.market.price} AVAX`,
      `Adaptations: ${snail.adaptations}`,
      `https://www.snailtrail.art/snails/${snail.id}/snail`,
      snail.image,
    );
    webhook.sendMessage();
    pingedSnail.push(snail.id);
  }
}
