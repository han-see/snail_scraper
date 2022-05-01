import { JsonRpcProvider } from '@ethersproject/providers';
import { parseSaleDataFromMarketplace, SaleEvent } from '../types/SaleEvent';
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

const soldSnailTopics =
  '0xdb9547d1dd4d503b0fb2c43a486eaab45eda512c8b43d5270a3fb6a25f3c6dc6';

export const soldSnailInMarketplace = {
  address: SNAIL_MARKETPLACE_CONTRACT,
  topics: [soldSnailTopics],
};

export class EventBot {
  private provider: JsonRpcProvider;
  private account: Account;

  constructor(account: Account) {
    this.provider = new JsonRpcProvider(AVAX_NODE);
    this.account = account;
  }

  async listenToEvent(filter) {
    console.log('Listening to the event');
    console.log(await this.provider.getNetwork());
    try {
      this.provider.on(filter, (log: SaleEvent) => {
        const data = parseSaleDataFromMarketplace(log.data);
        /* getSnailDetail(data.snailId).then((res) => {
          pingDiscord(res, data);
        }); */
      });
    } catch (err) {
      console.error(err);
    }
  }

  async connectToSnowsight() {
    if (this.account.wallet == undefined) {
      this.account.loadAccount();
    }
    const signed_key = await this.account.wallet.signMessage(SNOWSIGHT_KEY);

    const message = JSON.stringify({ signed_key: signed_key });

    const ws = new WebSocket(SNOWSIGHT_WS);

    ws.on('open', () => {
      ws.send(message);
    });

    ws.on('message', (data) => {
      const mempoolResponse: MempoolResponse = JSON.parse(data.toString());
      if (mempoolResponse.to == SNAIL_MARKETPLACE_CONTRACT.toLowerCase()) {
        console.log(Date.now());
        console.log(mempoolResponse);
      }
    });
  }

  async getSnailDetail(snailId: number) {
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
