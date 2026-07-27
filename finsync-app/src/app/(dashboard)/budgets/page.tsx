import { endOfMonth, startOfMonth } from "date-fns";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BudgetsManager } from "@/components/budgets/BudgetsManager";
import { getDisplayCurrency } from "@/lib/getUserCurrency";

export default async function BudgetsPage() {
  const session = await auth();
  const userId = session!.user.id;
  const { currency, rate } = await getDisplayCurrency(userId);
  const now = new Date();

  const [budgets, expenses] = await Promise.all([
    prisma.budget.findMany({
      where: { userId, month: now.getMonth() + 1, year: now.getFullYear() },
      orderBy: { category: "asc" },
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        type: "EXPENSE",
        date: { gte: startOfMonth(now), lte: endOfMonth(now) },
      },
    }),
  ]);

  const spentByCategory = new Map<string, number>();
  for (const e of expenses) {
    spentByCategory.set(
      e.category,
      (spentByCategory.get(e.category) ?? 0) + Number(e.amount)
    );
  }

  return (
    <div>
      <h1 className="animate-fade-up mb-6 text-2xl font-semibold">Budgets</h1>
      <BudgetsManager
        currency={currency}
        rate={rate}
        initialBudgets={budgets.map((b) => ({
          id: b.id,
          category: b.category,
          monthlyLimit: Number(b.monthlyLimit),
          spent: spentByCategory.get(b.category) ?? 0,
        }))}
      />
    </div>
  );
}
