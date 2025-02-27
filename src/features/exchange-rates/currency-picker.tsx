import { useState } from "react"
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
import { cn } from "@/lib/utils"
import { Currency } from "@/types"

interface CurrencyPickerProps {
  selectedCurrency: Currency | null,
  setSelectedCurrency: (currency: Currency) => void,
  currencies: Currency[],
}

export default function CurrencyPicker({
  selectedCurrency,
  setSelectedCurrency,
  currencies,
}: CurrencyPickerProps) {
  const [open, setOpen] = useState(false);
  
  return (
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
  )
}