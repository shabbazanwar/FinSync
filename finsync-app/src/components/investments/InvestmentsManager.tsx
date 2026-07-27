"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { HiOutlineTrash } from "react-icons/hi";
import { CHART_INK, colorForInvestmentType } from "@/lib/chartColors";
import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/dashboard/StatCard";

export type Investment = {
  id: string;
  name: string;
  type: "STOCK" | "ETF" | "MUTUAL_FUND" | "CRYPTO" | "REAL_ESTATE" | "OTHER";
  costBasis: number;
  currentValue: number;
};

const TYPE_LABEL: Record<Investment["type"], string> = {
  STOCK: "Stock",
  ETF: "ETF",
  MUTUAL_FUND: "Mutual fund",
  CRYPTO: "Crypto",
  REAL_ESTATE: "Real estate",
  OTHER: "Other",
};

export function InvestmentsManager({
  initialInvestments,
  currency,
  rate,
}: {
  initialInvestments: Investment[];
  currency: string;
  rate: number;
}) {
  const [investments, setInvestments] = useState(initialInvestments);
  const [name, setName] = useState("");
  const [type, setType] = useState<Investment["type"]>("STOCK");
  const [costBasis, setCostBasis] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [pending, setPending] = useState(false);

  const totalValue = investments.reduce((sum, i) => sum + i.currentValue, 0);
  const totalCost = investments.reduce((sum, i) => sum + i.costBasis, 0);
  const totalGain = totalValue - totalCost;

  const allocation = useMemo(() => {
    const totals = new Map<string, number>();
    for (const i of investments) {
      totals.set(i.type, (totals.get(i.type) ?? 0) + i.currentValue);
    }
    return Array.from(totals, ([type, value]) => ({ type, value }));
  }, [investments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cost = Number(costBasis);
    const value = Number(currentValue);
    if (!name.trim() || !cost || cost <= 0 || value < 0) {
      toast.error("Enter a name, cost basis, and current value");
      return;
    }

    setPending(true);
    const res = await fetch("/api/investments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, costBasis: cost, currentValue: value }),
    });
    setPending(false);

    if (!res.ok) {
      toast.error("Could not add investment");
      return;
    }

    const saved = await res.json();
    setInvestments((prev) => [saved, ...prev]);
    setName("");
    setCostBasis("");
    setCurrentValue("");
    toast.success("Investment added");
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/investments/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete investment");
      return;
    }
    setInvestments((prev) => prev.filter((i) => i.id !== id));
    toast.success("Investment deleted");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Portfolio value" value={totalValue} currency={currency} rate={rate} className="stagger-1" />
        <StatCard label="Cost basis" value={totalCost} currency={currency} rate={rate} className="stagger-2" />
        <StatCard
          label="Total gain/loss"
          value={totalGain}
          currency={currency}
          rate={rate}
          tone={totalGain >= 0 ? "positive" : "negative"}
          className="stagger-3"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="animate-fade-up stagger-4 h-fit space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-sm font-semibold">Add a holding</h2>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vanguard S&P 500 ETF"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Investment["type"])}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            >
              {(Object.keys(TYPE_LABEL) as Investment["type"][]).map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Cost basis
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={costBasis}
              onChange={(e) => setCostBasis(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Current value
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 disabled:opacity-60"
          >
            Add holding
          </button>
        </form>

        <div className="space-y-6">
          {allocation.length > 0 && (
            <div className="animate-fade-up stagger-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold">Allocation</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={allocation}
                    dataKey="value"
                    nameKey="type"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    stroke={CHART_INK.surface}
                    strokeWidth={2}
                  >
                    {allocation.map((a) => (
                      <Cell key={a.type} fill={colorForInvestmentType(a.type)} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      formatCurrency(Number(value), currency, rate),
                      TYPE_LABEL[name as Investment["type"]] ?? String(name),
                    ]}
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      borderColor: CHART_INK.gridline,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="space-y-3">
            {investments.length === 0 && (
              <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
                No holdings yet.
              </p>
            )}
            <AnimatePresence initial={false}>
              {investments.map((inv, i) => {
                const gain = inv.currentValue - inv.costBasis;
                return (
                  <motion.div
                    key={inv.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: colorForInvestmentType(inv.type) }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {inv.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {TYPE_LABEL[inv.type]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right tabular-nums">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(inv.currentValue, currency, rate)}
                        </p>
                        <p
                          className={`text-xs ${gain >= 0 ? "text-emerald-600" : "text-red-600"}`}
                        >
                          {gain >= 0 ? "+" : ""}
                          {formatCurrency(gain, currency, rate)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="text-gray-400 transition-colors hover:text-red-600"
                        aria-label="Delete"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
