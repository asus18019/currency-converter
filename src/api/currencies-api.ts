import axios from "axios"
import { API_KEY, API_URL } from "./api"
import { AllCurrenciesResponse, CurrencyCode, ExchangeRatesResponse } from "@/types";

export const currenciesApi = {
  fetchAllCurrencies() {
    return axios.get<AllCurrenciesResponse>(`${API_URL}/currencies?apikey=${API_KEY}`)
  },
  fetchLatest(code: CurrencyCode) {
    return axios.get<ExchangeRatesResponse>(`${API_URL}/latest?apikey=${API_KEY}&currencies=&base_currency=${code}`)
  }
}