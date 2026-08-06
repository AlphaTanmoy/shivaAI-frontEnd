import { environment } from '../../../environments/environment';

const BASE_URL = environment.apiUrl

export const API = {

  CHAT: `${BASE_URL}/api/chat`,
  HEALTH: `${BASE_URL}/health`,
  GET_ALL_COUNTRIES: `${BASE_URL}/countries`,
  ENUMS: `${BASE_URL}/enums`,

} as const;