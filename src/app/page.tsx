"use client"

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight } from "lucide-react";

import CurrencyInput from "@/components/custom/currency-input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/custom/loading-spinner";
import ConfirmSwapDialog from "@/components/custom/confirm-swap-dialog";
import { currenciesApi } from "@/api/currencies-api";
import { Currency } from "@/types";
import { cn, formatDate } from "@/lib/utils";

export interface CurrencyInput {
  amount: string,
  currency?: Currency,
}

export default function Home() {
  const [from, setFrom] = useState<CurrencyInput>({ amount: '' });
  const [to, setTo] = useState<CurrencyInput>({ amount: '' });
  const [mirrored, setMirrored] = useState(false);
  
  const [currentRate, setCurrentRate] = useState(0);

  const { data: currencies, isPending, error } = useQuery({
    queryKey: ['currencies'],
    queryFn: currenciesApi.fetchAllCurrencies,
  })

  const { data: rates, isPending: isPendingRate, error: rateError } = useQuery({
    queryKey: ['rates', from.currency?.code],
    queryFn: () => currenciesApi.fetchLatest(from.currency?.code || ""),
    enabled: !!from.currency?.code,
  })

  useEffect(() => {
    if(!currencies) return;

    setFrom(prev => ({ ...prev, currency: currencies[0] }));
    setTo(prev => ({ ...prev, currency: currencies[1] }));
  }, [currencies])

  useEffect(() => {
    if(!rates) return;

    const newRate = rates.data.find(r => r.code === to.currency?.code)?.value || 0;
    setCurrentRate(newRate);
    setTo(prev => ({ ...prev, amount: (Number(from.amount) * newRate).toFixed(2) }));
  }, [rates, to.currency?.code])

  const updatedAt = formatDate(new Date(rates?.meta?.last_updated_at || ''));

  const swap = () => {
    setFrom(to);
    setTo(from);
    setMirrored((prev) => !prev);
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
      const newRate = (rates?.data.find(r => r.code === newValue.currency?.code)?.value) || 0;
      setCurrentRate(newRate);
      setTo(prev => ({ ...prev, amount: (Number(from.amount) * newRate).toFixed(2) }))
    }
  }

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

  return (
    <main className="h-full flex justify-center flex-col items-center">
      <h1 className="text-5xl font-prompt mb-10 mx-auto uppercase">Currency Converter</h1>
      <div className="w-full p-8 border rounded-xl shadow-lg">
        <div className="flex justify-between items-center gap-4">
          <div className="w-full">
            <label htmlFor="amount">Amount</label>
            <CurrencyInput id="amount" state={from} onUpdate={onFromUpdate} currencies={currencies} />
          </div>
          <Button variant="ghost" className="mt-6 hover:bg-transparent" onClick={swap}>
            <ArrowLeftRight className={cn("!size-5 transition-transform duration-300", mirrored && "scale-x-[-1]")} />
          </Button>
          <div className="w-full">
            <label htmlFor="converted_to">Converted to</label>
            <CurrencyInput id="converted_to" state={to} onUpdate={onToUpdate} currencies={currencies} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="mt-4 flex items-center gap-4">
              <h3 className="text-xl font-semibold">
                1 {from.currency?.code} ≈ {isPendingRate ? "**" : currentRate.toFixed(2)} {to.currency?.code}
              </h3>
              {isPendingRate && <LoadingSpinner className="size-6" />}
            </div>
            <p className="mt-1 text-gray-500 text-sm">
              Updated at: <span className="text-primary-foreground">{updatedAt}</span>
            </p>
          </div>
          <ConfirmSwapDialog from={from} to={to} rate={currentRate} onConfirm={() => console.log("Sucesfully swapped")}>
            <Button className="mt-6" disabled={!from.amount || isPendingRate}>Preview</Button>
          </ConfirmSwapDialog>
        </div>
      </div>
    </main>
  );
}
