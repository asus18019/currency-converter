import ExchangeRatesView from "@/features/exchange-rates/exchange-rates-view";

export default function Home() {
  return (
    <main className="flex flex-col h-screen max-w-screen-lg">
      <h1 className="text-5xl font-prompt mb-5 uppercase">Currency Rates</h1>
      <ExchangeRatesView />
    </main>
  );
}
