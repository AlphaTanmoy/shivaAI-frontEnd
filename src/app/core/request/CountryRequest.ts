export interface CountryRequest {

  queryString?: string;

  limit?: number;

  giveCount?: boolean;

  giveData?: boolean;

  considerMaxDateRange?: boolean;

  offsetToken?: string;

  serviceable?: boolean;

}