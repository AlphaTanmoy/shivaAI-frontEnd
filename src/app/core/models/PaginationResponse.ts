import { FilterOption } from "./FilterOption";

export interface PaginationResponse<T> {

  data: T[];

  offsetToken: string;

  recordCount: number;

  filterUsed: FilterOption[];

  miscIdOne: string;

  miscIdTwo: string;

}