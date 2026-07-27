"use client";

import { formatCurrency } from "@/lib/format";
import { useCountUp } from "@/hooks/useCountUp";

export function StatCard({
  label,
  value,
  currency,
  rate,
  tone = "default",
  className = "",
}: {
  label: string;
  value: number;
  currency: string;
  rate: number;
  tone?: "default" | "positive" | "negative";
  className?: string;
}) {
  const animatedValue = useCountUp(value);

  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
        ? "text-red-600"
        : "text-gray-900";

  return (
    <div
      className={`animate-fade-up rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md ${className}`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tabular-nums ${toneClass}`}>
        {formatCurrency(animatedValue, currency, rate)}
      </p>
    </div>
  );
}
