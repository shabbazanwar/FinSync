"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/categories";
import { formatCurrency, formatDate } from "@/lib/format";

export type Transaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  note: string | null;
  date: string;
};

type FormState = {
  type: "INCOME" | "EXPENSE";
  amount: string;
  category: string;
  note: string;
  date: string;
};

const emptyForm: FormState = {
  type: "EXPENSE",
  amount: "",
  category: EXPENSE_CATEGORIES[0],
  date: new Date().toISOString().slice(0, 10),
  note: "",
};

export function TransactionsManager({
  initialTransactions,
  currency,
  rate,
}: {
  initialTransactions: Transaction[];
  currency: string;
  rate: number;
}) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const categories =
    form.type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function startEdit(t: Transaction) {
    setEditingId(t.id);
    setForm({
      type: t.type,
      amount: String(t.amount),
      category: t.category,
      note: t.note ?? "",
      date: t.date.slice(0, 10),
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setPending(true);
    const payload = {
      type: form.type,
      amount,
      category: form.category,
      note: form.note || undefined,
      date: form.date,
    };

    const res = await fetch(
      editingId ? `/api/transactions/${editingId}` : "/api/transactions",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    setPending(false);

    if (!res.ok) {
      toast.error("Could not save transaction");
      return;
    }

    const saved: Transaction = await res.json();
    setTransactions((prev) =>
      editingId
        ? prev.map((t) => (t.id === editingId ? saved : t))
        : [saved, ...prev]
    );
    toast.success(editingId ? "Transaction updated" : "Transaction added");
    resetForm();
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete transaction");
      return;
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.success("Transaction deleted");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form
        onSubmit={handleSubmit}
        className="animate-fade-up h-fit space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="text-sm font-semibold">
          {editingId ? "Edit transaction" : "Add transaction"}
        </h2>

        <div className="flex gap-2">
          {(["EXPENSE", "INCOME"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  type,
                  category:
                    type === "INCOME"
                      ? INCOME_CATEGORIES[0]
                      : EXPENSE_CATEGORIES[0],
                }))
              }
              className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors duration-150 ${
                form.type === type
                  ? type === "INCOME"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {type === "INCOME" ? "Income" : "Expense"}
            </button>
          ))}
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
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Date
          </label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Note (optional)
          </label>
          <input
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 disabled:opacity-60"
          >
            {editingId ? "Save changes" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors duration-150 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="animate-fade-up overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No transactions yet.
                </td>
              </tr>
            )}
            <AnimatePresence initial={false}>
              {transactions.map((t) => (
                <motion.tr
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-4 py-3">{t.category}</td>
                  <td className="px-4 py-3 text-gray-500">{t.note || "—"}</td>
                  <td
                    className={`px-4 py-3 text-right font-medium whitespace-nowrap tabular-nums ${
                      t.type === "INCOME" ? "text-emerald-600" : "text-gray-900"
                    }`}
                  >
                    {t.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(t.amount, currency, rate)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(t)}
                        className="text-gray-400 transition-colors hover:text-emerald-600"
                        aria-label="Edit"
                      >
                        <HiOutlinePencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-gray-400 transition-colors hover:text-red-600"
                        aria-label="Delete"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
