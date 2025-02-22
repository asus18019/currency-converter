"use client"

import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { currenciesApi } from "@/api/currencies-api";
import CurrencyInput from "@/components/custom/currency-input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/custom/loading-spinner";
import ConfirmSwapDialog from "@/components/custom/confirm-swap-dialog";
import { cn, formatDate, mockCurrencies } from "@/lib/utils";
import { AllCurrenciesResponse, Currency, ExchangeRate } from "@/types";

export interface CurrencyInput {
  amount: string,
  currency?: Currency,
}

interface ExchangeRates {
  meta: {
    last_updated_at: string;
  },
  data: ExchangeRate[];
}

export default function Home() {
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [from, setFrom] = useState<CurrencyInput>({ amount: '' });
  const [to, setTo] = useState<CurrencyInput>({ amount: '' });
  const [mirrored, setMirrored] = useState(false);
  const [rates, setRates] = useState<ExchangeRates>({ meta: { last_updated_at: '' }, data: [] });
  const updatedAt = formatDate(new Date(rates.meta.last_updated_at));
  
  const [currentRate, setCurrentRate] = useState(0);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setMirrored((prev) => !prev);
  }

  useEffect(() => {
    fetchCurrencies();
  }, [])

  useEffect(() => {
    if(currencies.length < 1) return;
    fetchRates();
  }, [currencies.length, from.currency?.code])

  const fetchCurrencies = async () => {
    try {
      // const response = await currenciesApi.fetchAllCurrencies();
      const data = mockCurrencies as AllCurrenciesResponse;
      // const parsed = Object.values(response.data.data);
      const parsed = Object.values(data.data);
      setCurrencies(parsed);

      setIsLoadingRate(false);

      setFrom(prev => ({ ...prev, currency: parsed[0] }));
      setTo(prev => ({ ...prev, currency: parsed[1] }));
    } catch (error) {
      console.log(error);
    }
  }

  const fetchRates = async () => {
    if(!from.currency || !to.currency) return;
    setIsLoadingRate(true);

    try {
      const res = await currenciesApi.fetchLatest(from.currency.code);
      const parsedRates = { ...res.data, data: Object.values(res.data.data) };
      setRates(parsedRates);
      const newRate = parsedRates.data.find(r => r.code === to.currency?.code)?.value || 0;
      setCurrentRate(newRate);
      setTo(prev => ({ ...prev, amount: (Number(from.amount) * newRate).toFixed(2) }))
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingRate(false);
    }
  }

  const onFromUpdate = (newValue: CurrencyInput) => {
    setFrom(newValue);

    if(newValue.amount !== from.amount) {
      setTo(prev => ({ ...prev, amount: (Number(newValue.amount) * currentRate).toFixed(2) }))
    }
  }

  const onToUpdate = (newValue: CurrencyInput) => {
    setTo(newValue);

    if(newValue.amount !== to.amount) {
      setFrom(prev => ({ ...prev, amount: (Number(newValue.amount) / currentRate).toFixed(2) }))
    }
    
    if(newValue.currency?.code !== to.currency?.code) {
      const newRate = (rates.data.find(r => r.code === newValue.currency?.code)?.value) || 0;
      setCurrentRate(newRate);
      setTo(prev => ({ ...prev, amount: (Number(from.amount) * newRate).toFixed(2) }))
    }
  }

  if(currencies.length === 0) {
    return (
      <h1>Server is not available...</h1>
    )
  }

  return (
    <div className="h-full flex justify-center flex-col items-center">
      <h1 className="text-5xl font-prompt mb-10 mx-auto uppercase">Currency Converter</h1>
      <div className="w-full p-8 border rounded-xl shadow-lg">
        <div className="flex justify-between items-center gap-4">
          <div className="w-full">
            <label htmlFor="">Amount</label>
            <CurrencyInput state={from} onUpdate={onFromUpdate} currencies={currencies} />
          </div>
          <Button variant="ghost" className="mt-6 hover:bg-transparent" onClick={swap}>
            <ArrowLeftRight className={cn("!size-5 transition-transform duration-300", mirrored && "scale-x-[-1]")} />
          </Button>
          <div className="w-full">
            <label htmlFor="">Converted to</label>
            <CurrencyInput state={to} onUpdate={onToUpdate} currencies={currencies} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="mt-4 flex items-center gap-4">
              <h3 className="text-xl font-semibold">
                1 {from.currency?.code} ≈ {isLoadingRate ? "**" : currentRate} {to.currency?.code}
              </h3>
              {isLoadingRate && <LoadingSpinner className="size-6" />}
            </div>
            <p className="mt-1 text-gray-500 text-sm">
              Updated at: <span className="text-primary-foreground">{updatedAt}</span>
            </p>
          </div>
          <ConfirmSwapDialog from={from} to={to} rate={currentRate} onConfirm={() => console.log("Sucesfully swapped")}>
            <Button className="mt-6" disabled={!from.amount || isLoadingRate}>Preview</Button>
          </ConfirmSwapDialog>
        </div>
      </div>
    </div>
  );
}
