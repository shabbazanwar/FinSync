"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlineTrash } from "react-icons/hi";
import { EXPENSE_CATEGORIES } from "@/lib/categories";
import { formatCurrency, formatDate } from "@/lib/format";
import { toMonthlyCost } from "@/lib/subscriptions";

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  billingCycle: "WEEKLY" | "MONTHLY" | "YEARLY";
  nextBillingDate: string;
  category: string;
  active: boolean;
};

const CYCLE_LABEL: Record<Subscription["billingCycle"], string> = {
  WEEKLY: "week",
  MONTHLY: "month",
  YEARLY: "year",
};

export function SubscriptionsManager({
  initialSubscriptions,
  currency,
  rate,
}: {
  initialSubscriptions: Subscription[];
  currency: string;
  rate: number;
}) {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [showCancelled, setShowCancelled] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] =
    useState<Subscription["billingCycle"]>("MONTHLY");
  const [nextBillingDate, setNextBillingDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [pending, setPending] = useState(false);

  const visible = subscriptions.filter((s) => showCancelled || s.active);
  const totalMonthly = useMemo(
    () =>
      subscriptions
        .filter((s) => s.active)
        .reduce((sum, s) => sum + toMonthlyCost(s.amount, s.billingCycle), 0),
    [subscriptions]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!name.trim() || !value || value <= 0) {
      toast.error("Enter a name and a valid amount");
      return;
    }

    setPending(true);
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        amount: value,
        billingCycle,
        nextBillingDate,
        category,
      }),
    });
    setPending(false);

    if (!res.ok) {
      toast.error("Could not add subscription");
      return;
    }

    const saved = await res.json();
    setSubscriptions((prev) =>
      [...prev, saved].sort((a, b) =>
        a.nextBillingDate.localeCompare(b.nextBillingDate)
      )
    );
    setName("");
    setAmount("");
    toast.success("Subscription added");
  }

  async function handleCancel(id: string) {
    const res = await fetch(`/api/subscriptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: false }),
    });
    if (!res.ok) {
      toast.error("Could not cancel subscription");
      return;
    }
    const saved = await res.json();
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? saved : s)));
    toast.success("Subscription cancelled");
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete subscription");
      return;
    }
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    toast.success("Subscription deleted");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form
        onSubmit={handleSubmit}
        className="animate-fade-up h-fit space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-sm font-semibold">Add a subscription</h2>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Netflix"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Amount
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Billing cycle
          </label>
          <select
            value={billingCycle}
            onChange={(e) =>
              setBillingCycle(e.target.value as Subscription["billingCycle"])
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Next billing date
          </label>
          <input
            type="date"
            required
            value={nextBillingDate}
            onChange={(e) => setNextBillingDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 disabled:opacity-60"
        >
          Add subscription
        </button>
      </form>

      <div className="space-y-4">
        <div className="animate-fade-up flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Total recurring cost</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 tabular-nums">
              {formatCurrency(totalMonthly, currency, rate)}
              <span className="text-sm font-normal text-gray-400"> /month</span>
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-500">
            <input
              type="checkbox"
              checked={showCancelled}
              onChange={(e) => setShowCancelled(e.target.checked)}
            />
            Show cancelled
          </label>
        </div>

        <div className="space-y-3">
          {visible.length === 0 && (
            <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
              No subscriptions yet.
            </p>
          )}
          <AnimatePresence initial={false}>
            {visible.map((s, i) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{
                  opacity: s.active ? 1 : 0.5,
                  y: 0,
                  transition: { delay: i * 0.05 },
                }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {s.name}{" "}
                    {!s.active && (
                      <span className="text-xs font-normal text-gray-400">
                        (cancelled)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    {s.category} · Next billed {formatDate(s.nextBillingDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900 tabular-nums">
                    {formatCurrency(s.amount, currency, rate)}
                    <span className="text-xs font-normal text-gray-400">
                      /{CYCLE_LABEL[s.billingCycle]}
                    </span>
                  </span>
                  {s.active ? (
                    <button
                      onClick={() => handleCancel(s.id)}
                      className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-gray-400 transition-colors hover:text-red-600"
                      aria-label="Delete"
                    >
                      <HiOutlineTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
