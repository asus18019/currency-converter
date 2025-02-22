export type CurrencyCode = string;

export interface Currency {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number; 
  rounding: number;
  code: CurrencyCode;
  name_plural: string;
  type: "fiat" | "crypto";
  countries: string[];
};

export interface AllCurrenciesResponse {
  data: Record<string, Currency>
}

export interface ExchangeRate {
  code: CurrencyCode,
  value: number,
}

export interface ExchangeRatesResponse {
  meta: {
    last_updated_at: string;
  },
  data: Record<CurrencyCode, ExchangeRate>;
}