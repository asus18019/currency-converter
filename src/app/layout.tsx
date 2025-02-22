import type { Metadata } from "next";
import { Inter, Prompt } from "next/font/google"
import "./globals.css";
import Nav from "@/components/custom/nav";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'] });
const prompt = Prompt({ subsets: ['latin'], weight: '700',   variable: '--font-prompt', });

export const metadata: Metadata = {
  title: "Currency Converter",
  description: "Real-time currency converter app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <div className="flex flex-col h-screen max-w-screen-lg mx-auto">
          <Nav />
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
