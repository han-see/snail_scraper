import { BigNumber } from 'ethers';
import { AbiCoder, formatEther } from 'ethers/lib/utils';

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
  seller: string;
  sellPrice: string;
  isOnSale: boolean;
}

export function parseListingDataFromMarketplace(data) {
  console.log('Parsing data')
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
