"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import CurrencyPicker from "./currency-picker"
import { Currency } from "@/types";
import { currenciesApi } from "@/api/currencies-api";
import { LoadingSpinner } from "../../components/custom/loading-spinner";
import RatesFilter from "./rates-filter";
import RatesList from "./rates-list";

export default function ExchangeRatesView() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [filterValue, setFilterValue] = useState("");

  const { data: currencies, isPending, error } = useQuery({
    queryKey: ['currencies'],
    queryFn: currenciesApi.fetchAllCurrencies,
  });

  const { data: rates, isFetching: isFetchingRate, error: rateError } = useQuery({
    queryKey: ['rates', selectedCurrency],
    queryFn: () => currenciesApi.fetchLatest(selectedCurrency?.code || ""),
    enabled: !!selectedCurrency
  });

  if(isPending) {
    return (
      <h1>Loading...</h1>
    )
  }

  if(!currencies || error || rateError) {
    return (
      <h1>Unexpected error fetching currencies or exchange rates. Try again later...</h1>
    )
  }
  
  const filteredRates = rates?.data.filter(currency => 
    currency.code.toLocaleLowerCase().includes(filterValue.toLowerCase())
  ) || [];

  return (
    <>
      <div className="flex gap-4">
        <CurrencyPicker 
          selectedCurrency={selectedCurrency} 
          setSelectedCurrency={setSelectedCurrency} 
          currencies={currencies} 
        />
        <RatesFilter 
          filterValue={filterValue} 
          setFilterValue={setFilterValue} 
          isCurrencySelected={!!selectedCurrency} 
        />
      </div>
      {isFetchingRate ? (
        <LoadingSpinner className="mx-auto my-4 !size-10" />
      ) : (
        filteredRates.length > 0 ? (
          <RatesList rates={filteredRates} selectedCurrency={selectedCurrency} />
        ) : (
          selectedCurrency && <p>No results found</p>
        )
      )}
    </>
  );
}