import { Input } from "../../components/ui/input";

interface RatesFilterProps {
  filterValue: string,
  setFilterValue: (value: string) => void,
  isCurrencySelected: boolean,
}

export default function RatesFilter({ filterValue, setFilterValue, isCurrencySelected }: RatesFilterProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="search">Search</label>
      <Input 
        id="search"
        className="w-[300px]"
        value={filterValue} 
        onChange={e => setFilterValue(e.target.value)} 
        placeholder="Currency code..." 
        disabled={!isCurrencySelected}
      />
    </div>
  )
}