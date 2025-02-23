import axios from "axios"
import { API_KEY, API_URL } from "./api"
import { 
  AllCurrenciesResponse, 
  CurrencyCode, 
  ExchangeRates, 
  ExchangeRatesResponse 
} from "@/types";

export const currenciesApi = {
  async fetchAllCurrencies() {
    const response = await axios.get<AllCurrenciesResponse>(`${API_URL}/currencies?apikey=${API_KEY}&type=fiat`);
    return Object.values(response.data.data);
  },
  async fetchLatest(code: CurrencyCode): Promise<ExchangeRates> {
    const response = await axios.get<ExchangeRatesResponse>(`${API_URL}/latest?apikey=${API_KEY}&currencies=&base_currency=${code}&type=fiat`);
    return { ...response.data, data: Object.values(response.data.data) };
  }
}