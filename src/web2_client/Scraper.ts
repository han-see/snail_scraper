import axios from 'axios';
import { Marketplace } from '../common/MarketplaceResponse';
import * as fs from 'fs';
import { Adaptations, Family } from '../common/Family';
import { QueryAllSnail, QueryFilter } from './Query';

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

const queryFilter: QueryFilter = {
  family: Family.Atlantis,
  adaptations: [Adaptations.Dodge]
};

const queryAllSnail = new QueryAllSnail(queryFilter, 20);

export async function scrapeMarketplace() {
  try {
    const res = await axios.post<Marketplace>(URL, queryAllSnail, config);
    const data = JSON.stringify(res.data);
    await fs.writeFileSync('response.json', data);
    console.log(`Status: ${res.status}`);
  } catch (err) {
    console.error(err);
  }
}
