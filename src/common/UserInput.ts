import { IQueryFilter } from '../web2_client/Query';

export interface UserInput {
  discount: number;
  maxPrice: number;
  filter: IQueryFilter;
}
