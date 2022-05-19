import { BigNumber } from 'ethers';
import { AbiCoder, formatEther } from 'ethers/lib/utils';
<<<<<<< HEAD
import { SNAIL_MARKETPLACE_CONTRACT } from '../global/config';
=======
>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c

export interface BlockEvent {
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  removed: boolean;
  address: string;
  data: string;
  topics: string[];
  transactionHash: string;
  logIndex: number;
}

export interface SaleData {
  snailMarketId: BigNumber;
  snailId: number;
  seller: string;
  sellPrice: string;
  isOnSale: boolean;
  buyer: string;
}

export interface ListingData {
  snailMarketId: BigNumber;
  snailId: number;
  seller?: string;
  sellPrice: string;
  isOnSale?: boolean;
}

export function parseListingDataFromMarketplace(data) {
  console.log(new Date().toUTCString(), 'Parsing data');
  const abiCoder = new AbiCoder();
  const decodedData = abiCoder.decode(
    ['uint256', 'uint256', 'address', 'uint256', 'bool'],
    data,
  );
  const listingData: ListingData = {
    snailMarketId: decodedData[0].toString(),
    snailId: decodedData[1].toString(),
    seller: decodedData[2],
    sellPrice: formatEther(decodedData[3].toString()),
    isOnSale: decodedData[4],
  };
  return listingData;
}

export function parseSaleDataFromMarketplace(data) {
  const abiCoder = new AbiCoder();
  const decodedData = abiCoder.decode(
    ['uint256', 'uint256', 'address', 'uint256', 'bool', 'address'],
    data,
  );
  const saleData: SaleData = {
    snailMarketId: decodedData[0].toString(),
    snailId: decodedData[1].toString(),
    seller: decodedData[2],
    sellPrice: formatEther(decodedData[3].toString()),
    isOnSale: decodedData[4],
    buyer: decodedData[5],
  };
  return saleData;
}
<<<<<<< HEAD

export const marketplaceUpdatePriceTopics =
  '0x84e7202ffb140dbeb09920388f40e357a1211b905a1a82b54f213e64942f9daf';

export const marketplaceListSnailTopics =
  '0x8b5ebb2dc6de3438616ab5b99285b16a20fb015b845f3458d7215ec10de2c40f';

export const listingInMarketplace = {
  address: SNAIL_MARKETPLACE_CONTRACT,
  topics: [marketplaceListSnailTopics],
};

export const priceUpdateInMarketplace = {
  address: SNAIL_MARKETPLACE_CONTRACT,
  topics: [marketplaceUpdatePriceTopics],
};
=======
>>>>>>> 9761d364ec935f58f48aae3d91547d480b7ab99c
