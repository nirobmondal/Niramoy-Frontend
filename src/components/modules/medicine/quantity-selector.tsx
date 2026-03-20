"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type QuantitySelectorProps = {
  value: number;
  min?: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export function QuantitySelector({
  value,
  min = 1,
  max,
  disabled = false,
  onChange,
}: QuantitySelectorProps) {
  const safeValue = Math.min(Math.max(value, min), max);

  const decrement = () => {
    if (disabled || safeValue <= min) {
      return;
    }

    onChange(safeValue - 1);
  };

  const increment = () => {
    if (disabled || safeValue >= max) {
      return;
    }

    onChange(safeValue + 1);
  };

  return (
    <div
      className="inline-flex items-center gap-2"
      role="group"
      aria-label="Quantity selector"
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={decrement}
        disabled={disabled || safeValue <= min}
        aria-label="Decrease quantity"
        className="rounded-lg border-[#d5e3eb] bg-white text-[#2a4250] hover:bg-[#eef4f8]"
      >
        <Minus className="size-4" />
      </Button>

      <Input
        aria-label="Selected quantity"
        value={String(safeValue)}
        readOnly
        className="h-9 w-16 rounded-lg border-[#d5e3eb] bg-white text-center font-semibold text-[#1d3341]"
      />

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={increment}
        disabled={disabled || safeValue >= max}
        aria-label="Increase quantity"
        className="rounded-lg border-[#d5e3eb] bg-white text-[#2a4250] hover:bg-[#eef4f8]"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
