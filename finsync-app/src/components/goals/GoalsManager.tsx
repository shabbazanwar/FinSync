"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlineTrash } from "react-icons/hi";
import { formatCurrency, formatDate } from "@/lib/format";

export type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
};

export function GoalsManager({
  initialGoals,
  currency,
  rate,
}: {
  initialGoals: Goal[];
  currency: string;
  rate: number;
}) {
  const [goals, setGoals] = useState(initialGoals);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [pending, setPending] = useState(false);
  const [contribution, setContribution] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const target = Number(targetAmount);
    if (!title.trim() || !target || target <= 0) {
      toast.error("Enter a title and a valid target amount");
      return;
    }

    setPending(true);
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        targetAmount: target,
        deadline: deadline || undefined,
      }),
    });
    setPending(false);

    if (!res.ok) {
      toast.error("Could not create goal");
      return;
    }

    const saved = await res.json();
    setGoals((prev) => [saved, ...prev]);
    setTitle("");
    setTargetAmount("");
    setDeadline("");
    toast.success("Goal created");
  }

  async function handleContribute(goal: Goal) {
    const amount = Number(contribution[goal.id]);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    const res = await fetch(`/api/goals/${goal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentAmount: goal.currentAmount + amount }),
    });

    if (!res.ok) {
      toast.error("Could not update goal");
      return;
    }

    const saved = await res.json();
    setGoals((prev) => prev.map((g) => (g.id === goal.id ? saved : g)));
    setContribution((prev) => ({ ...prev, [goal.id]: "" }));

    if (saved.currentAmount >= saved.targetAmount) {
      toast.success(`🎉 Goal "${saved.title}" achieved!`);
    } else {
      toast.success("Contribution added");
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete goal");
      return;
    }
    setGoals((prev) => prev.filter((g) => g.id !== id));
    toast.success("Goal deleted");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form
        onSubmit={handleSubmit}
        className="animate-fade-up h-fit space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-sm font-semibold">New savings goal</h2>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Title
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Emergency fund"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Target amount
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Deadline (optional)
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 disabled:opacity-60"
        >
          Create goal
        </button>
      </form>

      <div className="space-y-3">
        {goals.length === 0 && (
          <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
            No savings goals yet.
          </p>
        )}
        <AnimatePresence initial={false}>
          {goals.map((g, i) => {
            const pct = Math.min(
              100,
              Math.round((g.currentAmount / g.targetAmount) * 100)
            );
            const achieved = g.currentAmount >= g.targetAmount;
            return (
              <motion.div
                key={g.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{g.title}</p>
                    {g.deadline && (
                      <p className="text-xs text-gray-400">
                        Due {formatDate(g.deadline)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(g.id)}
                    className="text-gray-400 transition-colors hover:text-red-600"
                    aria-label="Delete"
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                  </button>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    className={`h-full rounded-full ${achieved ? "bg-emerald-500" : "bg-emerald-400"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500 tabular-nums">
                  {formatCurrency(g.currentAmount, currency, rate)} of{" "}
                  {formatCurrency(g.targetAmount, currency, rate)} ({pct}%)
                  {achieved && " — goal reached!"}
                </p>

                {!achieved && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Add funds"
                      value={contribution[g.id] ?? ""}
                      onChange={(e) =>
                        setContribution((prev) => ({
                          ...prev,
                          [g.id]: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleContribute(g)}
                      className="shrink-0 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-gray-800"
                    >
                      Add
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
