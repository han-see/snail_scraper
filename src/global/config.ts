// Default AVAX RPC endpoint
export const AVAX_NODE = 'https://api.avax.network/ext/bc/C/rpc';

// Default AVAX RPC endpoint, for websockets
export const AVAX_WS_NODE = 'wss://api.avax.network/ext/bc/C/ws';

// Snail Marketplace graphql url
export const MARKETPLACE_GQL_URL = 'https://api.snailtrail.art/graphql/';

// Snowsight websocket
export const SNOWSIGHT_WS = 'ws://mempool-stream.snowsight.chainsight.dev:8589';

// Snowsight key
export const SNOWSIGHT_KEY =
  'Sign this message to authenticate your wallet with Snowsight.';

// Snail Marketplace Contract Address
export const SNAIL_MARKETPLACE_CONTRACT =
  '0xeb77bd67Bd607e5b7d9b78db82fad0DE395B5DeF';

// Default marketplace header get request
export const DEFAULT_MARKETPLACE_HEADER = {
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

// Unfinished Marketplace ABI
export const SNAIL_MARKETPLACE_ABI = [
  'function listMarketItem(uint256 snailId,uint256 price)',
  'function updatePrice(uint256 marketId, uint256 price)',
  '0x74fab4db (uint256 marketId)',
];
