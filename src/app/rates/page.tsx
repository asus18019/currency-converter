"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Check, ChevronsUpDown } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/custom/loading-spinner"
import { currenciesApi } from "@/api/currencies-api"
import { Currency } from "@/types"
import { cn } from "@/lib/utils"

export default function Home() {
  const [open, setOpen] = useState(false);
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
    <main className="flex flex-col h-screen max-w-screen-lg">
      <h1 className="text-5xl font-prompt mb-5 uppercase">Currency Rates</h1>
      <div className="flex gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="currency">Currency</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id="currency"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between rounded-md"
              >
                {selectedCurrency
                  ? currencies.find((currency) => currency.code === selectedCurrency.code)?.code
                  : "Pick currency..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search currency..." />
                <CommandList>
                  <CommandEmpty>No currency found.</CommandEmpty>
                  <CommandGroup>
                    {currencies.map((currency) => (
                      <CommandItem
                        key={currency.code}
                        value={currency.code}
                        onSelect={() => {
                          setSelectedCurrency(currency);
                          setOpen(false);
                        }}
                      >
                        {currency.code}
                        <Check
                          className={cn(
                            "ml-auto",
                            selectedCurrency?.code === currency.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="search">Search</label>
          <Input 
            id="search"
            className="w-[300px]"
            value={filterValue} 
            onChange={e => setFilterValue(e.target.value)} 
            placeholder="Currency code..." 
            disabled={!selectedCurrency}
          />
        </div>
      </div>
      {isFetchingRate ? (
        <LoadingSpinner className="mx-auto my-4 size-10" />
      ) : (
        filteredRates.length > 0 ? (
          <ul className="mt-4">
            {filteredRates.map((rate) => (
              <li key={rate.code}>
                <p>
                  1 {rate.code} = {(1 / rate.value).toFixed(2)} {selectedCurrency?.code}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          selectedCurrency && <p>No results found</p>
        )
      )}
    </main>
  );
}
