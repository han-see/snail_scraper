import {
  Family,
  Klass,
  Generation,
  Adaptations,
  Purity,
} from '../types/Family';
import { Gender } from '../types/SnailDetails';

export interface Query {
  operationName: string;
  variables: {
    filters: QueryFilter | IQueryFilter;
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

export interface IQueryFilter {
  family?: number;
  klass?: number;
  generation?: number;
  adaptations?: number[];
  purity?: number;
  gender?: number;
  visuals?: any;
}

/**
 * This class is for querying all snail from the snail marketplace mainly to check for the floor price
 */
export class QueryAllSnail implements Query {
  operationName = 'getAllSnail';
  variables: { filters: QueryFilter | IQueryFilter };
  query: string;

  constructor(filter: QueryFilter | IQueryFilter, private size: number = 12) {
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

/**
 * This class is to query single snail to get the snail detail
 */
export class QuerySingleSnail implements Query {
  operationName = 'getSingleSnail';
  variables = {
    filters: {},
  };
  query: string;
  constructor(private snailId: number) {
    this.snailId = snailId;
    this.query = `
      query getSingleSnail {
        snail_promise(token_id: ${this.snailId}) {
          ... on Problem {
            problem
            __typename
          }
          ... on Snail {
            id
            klass
            generation
            adaptations
            purity
            gender {
              value
              id
              __typename
            }
            name
            genome
            family
            image
            owner
            holder
            market {
              price
              item_id
              price_wei
              on_sale
              last_sale
              highest_sale
              __typename
            }
            gene_market {
              price
              item_id
              price_wei
              on_sale
              __typename
            }
            stats {
              races
              elo
              earned_avax
              earned_token
              win_ratio
              top_three_ratio
              experience {
                xp
                level
                on
                remaining
                reward
                __typename
              }
              __typename
            }
            visuals {
              trait_type
              value
              count
              percentage
              __typename
            }
            more_stats(seasons: [1]) {
              season
              season_stats {
                category_name
                category_id
                category_stats {
                  ... on CounterStat {
                    name
                    count
                    __typename
                  }
                  ... on MeanStat {
                    name
                    count
                    min
                    mean
                    max
                    std
                    __typename
                  }
                  __typename
                }
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
      }`;
  }
}
