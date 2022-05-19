import { IQueryFilter } from '../web2_client/Query';

export interface FilterInput {
  discount: number;
  maxPrice: number;
  filter: IQueryFilter;
}
