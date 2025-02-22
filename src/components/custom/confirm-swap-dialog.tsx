"use client"

import { useState } from "react";
import { toast } from "sonner"
import { CurrencyInput } from "@/app/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import InfoRow from "./info-row";

const FEE_PERCENTAGE = 0.005;

interface ConfirmSwapDialogProps {
  from: CurrencyInput,
  to: CurrencyInput,
  rate: number,
  onConfirm: () => void,
  children: React.ReactNode,
}

export default function ConfirmSwapDialog({ from, to, rate, onConfirm, children }: ConfirmSwapDialogProps) {
  const { amount: fromAmount, currency: fromCurrency } = from;
  const { amount: toAmount, currency: toCurrency } = to;

  const [open, setOpen] = useState(false);

  const totalFee = (Number(to.amount) * FEE_PERCENTAGE).toFixed(2);

  const submit = () => {
    onConfirm();
    setTimeout(() => {
      toast("Successfully swapped!")
      setOpen(false);
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Confirm Swap?</DialogTitle>
        </DialogHeader>
        <div>
          <InfoRow label="Amount">
            {fromAmount} {fromCurrency?.code} → {toAmount} {toCurrency?.code}
          </InfoRow>
          <InfoRow label="Exchange Rate">
            1 {fromCurrency?.code} ≈ {rate} {toCurrency?.code}
          </InfoRow>
          <InfoRow label="Fee (0.5%)">
            {totalFee} {toCurrency?.code}
          </InfoRow>
        </div>
        <div className="flex justify-end items-center gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}