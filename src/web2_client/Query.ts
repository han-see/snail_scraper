import {
  Family,
  Klass,
  Generation,
  Adaptations,
  Purity,
} from '../common/Family';
import { Gender } from '../common/SnailDetails';

export interface Query {
  operationName: string;
  variables: {
    filters: QueryFilter;
  };
  query: string;
}

export interface QueryFilter {
  family?: Family;
  klass?: Klass;
  generation?: Generation;
  adaptations?: Adaptations[];
  purity?: Purity;
  gender?: Gender;
  visuals?: any;
}

export class QueryAllSnail implements Query {
  operationName = 'getAllSnail';
  variables: { filters: QueryFilter };
  query: string;

  constructor(filter: QueryFilter, private size: number = 12) {
    this.operationName = 'getAllSnail';
    this.variables = {
      filters: filter,
    };
    this.query = `
        query getAllSnail($filters: SnailFilters) {
            marketplace_promise(limit: ${this.size}, offset: 0, order: 1, filters: $filters) {
                ... on Problem {
                problem
                __typename
                }
                ... on Snails {
                snails {
                    id
                    adaptations
                    name
                    image
                    market {
                    price
                    item_id
                    on_sale
                    price_wei
                    __typename
                    }
                    __typename
                }
                count
                __typename
                }
                __typename
            }
        }`;
  }
}
