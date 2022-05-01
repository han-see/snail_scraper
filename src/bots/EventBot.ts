import { JsonRpcProvider } from '@ethersproject/providers';
import {
  AVAX_NODE,
  DEFAULT_MARKETPLACE_HEADER,
  MARKETPLACE_GQL_URL,
  SNOWSIGHT_KEY,
  SNOWSIGHT_WS,
} from '../global/config';
import { SnailDetails } from '../types/SnailDetails';
import axios from 'axios';
import { QuerySingleSnail } from '../web2_client/Query';
import { SNAIL_MARKETPLACE_CONTRACT } from '../global/addresses';
import WebSocket from 'ws';
import { Account } from '../global/Account';
import { MempoolResponse } from '../types/MempoolResponse';
import { BigNumber } from 'ethers';
import 'dotenv/config';
import { SnailFloorPrice } from '../types/SnailFloorPrice';
import * as fs from 'fs';
import { formatEther } from 'ethers/lib/utils';
import {
  BlockEvent,
  parseListingDataFromMarketplace,
} from '../types/MarketplaceEvent';

const minimumDiscount = parseInt(process.env.DISCOUNT);

const maxPrice = parseInt(process.env.MAXPRICE);

const marketplaceUpdatePriceTopics =
  '0x84e7202ffb140dbeb09920388f40e357a1211b905a1a82b54f213e64942f9daf';

const marketplaceListSnailTopics =
  '0x8b5ebb2dc6de3438616ab5b99285b16a20fb015b845f3458d7215ec10de2c40f';

const listingInMarketplace = {
  address: SNAIL_MARKETPLACE_CONTRACT,
  topics: [marketplaceUpdatePriceTopics, marketplaceListSnailTopics],
};

export class EventBot {
  private provider: JsonRpcProvider;
  private account: Account;
  private snailFloorPrice: SnailFloorPrice[];

  constructor(account: Account) {
    this.provider = new JsonRpcProvider(AVAX_NODE);
    this.account = account;
    this.snailFloorPrice = JSON.parse(
      fs.readFileSync('../floorPrice.json').toString(),
    );
  }

  async listenToListingEvent() {
    console.log('Listening to the update price event');
    console.log(await this.provider.getNetwork());
    try {
      this.provider.on(listingInMarketplace, (log: BlockEvent) => {
        const data = parseListingDataFromMarketplace(log.data);

        this.getSnailDetail(data.snailId).then((res) => {
          const snailPrice = parseInt(formatEther(data.sellPrice));
          const snailFamily = res.data.snail_promise.family;
          const floorPrice = this.snailFloorPrice[snailFamily];
          const discountPrice = floorPrice * (1 - minimumDiscount);

          if (snailPrice <= discountPrice && snailPrice <= maxPrice) {
            // buy snail from marketplace
            console.log(data);
          }
        });
      });
    } catch (err) {
      console.error(err);
    }
  }

  async getSnailDetail(snailId: number): Promise<SnailDetails> {
    try {
      const res = await axios.post<SnailDetails>(
        MARKETPLACE_GQL_URL,
        new QuerySingleSnail(snailId),
        DEFAULT_MARKETPLACE_HEADER,
      );
      console.log(res.status);
      return res.data;
    } catch (err) {
      console.error('Error fetching single snail', err);
    }
    return null;
  }
}
