"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown } from "lucide-react";
 
import { amountRegExp, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CurrencyInput as CurrencyInputType } from "@/app/page";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Currency } from "@/types";

interface CurrencyInputProps {
  state: CurrencyInputType,
  onUpdate: (value: CurrencyInputType) => void,
  currencies: Currency[],
}

export default function CurrencyInput({ state, onUpdate, currencies }: CurrencyInputProps) {
  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    const validValue = currentValue.match(amountRegExp);
    
    if (validValue || currentValue === "") {
      onUpdate({ ...state, amount: currentValue });
    }
  };
  
  return (
    <div className="border border-input rounded-md mt-2 flex items-center focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1">
      <Input 
        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0" 
        value={state.amount}
        onChange={handleChange}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-[120px] justify-between rounded-l-none rounded-r-sm"
          >
            {state.currency?.code}
            <ChevronDown className="opacity-50" />
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
                      onUpdate({ ...state, currency });
                      setOpen(false)
                    }}
                  >
                    {currency.code}
                    <Check
                      className={cn(
                        "ml-auto",
                        state.currency?.code === currency.code ? "opacity-100" : "opacity-0"
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
  )
}