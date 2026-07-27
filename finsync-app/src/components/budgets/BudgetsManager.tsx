"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlineTrash } from "react-icons/hi";
import { EXPENSE_CATEGORIES } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";

export type Budget = {
  id: string;
  category: string;
  monthlyLimit: number;
  spent: number;
};

const now = new Date();

export function BudgetsManager({
  initialBudgets,
  currency,
  rate,
}: {
  initialBudgets: Budget[];
  currency: string;
  rate: number;
}) {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [pending, setPending] = useState(false);

  const availableCategories = EXPENSE_CATEGORIES.filter(
    (c) => !budgets.some((b) => b.category === c)
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const limit = Number(monthlyLimit);
    if (!limit || limit <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setPending(true);
    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        monthlyLimit: limit,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      }),
    });
    setPending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Could not save budget");
      return;
    }

    const saved = await res.json();
    setBudgets((prev) => [...prev, { ...saved, spent: 0 }]);
    setMonthlyLimit("");
    toast.success("Budget added");
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete budget");
      return;
    }
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    toast.success("Budget deleted");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form
        onSubmit={handleSubmit}
        className="animate-fade-up h-fit space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-sm font-semibold">Set a monthly budget</h2>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          >
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Monthly limit
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={pending || availableCategories.length === 0}
          className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 disabled:opacity-60"
        >
          {availableCategories.length === 0
            ? "All categories budgeted"
            : "Add budget"}
        </button>
      </form>

      <div className="space-y-3">
        {budgets.length === 0 && (
          <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
            No budgets set for this month yet.
          </p>
        )}
        <AnimatePresence initial={false}>
          {budgets.map((b, i) => {
            const pct = Math.min(100, Math.round((b.spent / b.monthlyLimit) * 100));
            const over = b.spent > b.monthlyLimit;
            return (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">{b.category}</span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm tabular-nums ${over ? "text-red-600" : "text-gray-500"}`}
                    >
                      {formatCurrency(b.spent, currency, rate)} / {formatCurrency(b.monthlyLimit, currency, rate)}
                    </span>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-gray-400 transition-colors hover:text-red-600"
                      aria-label="Delete"
                    >
                      <HiOutlineTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    className={`h-full rounded-full ${over ? "bg-red-500" : "bg-emerald-500"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                {over && (
                  <p className="mt-1.5 text-xs text-red-600">
                    Over budget by {formatCurrency(b.spent - b.monthlyLimit, currency, rate)}
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
