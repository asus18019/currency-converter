import { Currency, ExchangeRate } from "@/types";

interface RatesList {
  rates: ExchangeRate[],
  selectedCurrency: Currency | null,
}

export default function RatesList({ rates, selectedCurrency }: RatesList) {
  return (
    <ul className="mt-4">
      {rates?.map((rate) => (
        <li key={rate.code}>
          <p>
            1 {rate.code} = {(1 / rate.value).toFixed(2)} {selectedCurrency?.code}
          </p>
        </li>
      ))}
    </ul>
  )
}