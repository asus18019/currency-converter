import ConverterView from "@/features/converter/converter-view";

export default function Home() {
  return (
    <main className="h-full flex justify-center flex-col items-center">
      <h1 className="text-5xl font-prompt mb-10 mx-auto uppercase">Currency Converter</h1>
      <ConverterView />
    </main>
  );
}
