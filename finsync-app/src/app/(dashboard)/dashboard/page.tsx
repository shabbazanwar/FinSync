import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { IncomeExpenseBarChart } from "@/components/charts/IncomeExpenseBarChart";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { generateInsights } from "@/lib/insights";
import { formatCurrency, formatDate } from "@/lib/format";
import { getDisplayCurrency } from "@/lib/getUserCurrency";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;
  const { currency, rate } = await getDisplayCurrency(userId);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const sixMonthsAgo = startOfMonth(subMonths(now, 5));
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const [
    allTime,
    thisMonth,
    lastMonth,
    recentTransactions,
    sixMonthTransactions,
    budgets,
    investments,
  ] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["type"],
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.transaction.findMany({
      where: { userId, date: { gte: monthStart, lte: monthEnd } },
    }),
    prisma.transaction.findMany({
      where: { userId, date: { gte: lastMonthStart, lte: lastMonthEnd } },
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
    }),
    prisma.transaction.findMany({
      where: { userId, date: { gte: sixMonthsAgo, lte: monthEnd } },
    }),
    prisma.budget.findMany({
      where: { userId, month: now.getMonth() + 1, year: now.getFullYear() },
    }),
    prisma.investment.findMany({ where: { userId } }),
  ]);

  const totalIncome = Number(
    allTime.find((g) => g.type === "INCOME")?._sum.amount ?? 0
  );
  const totalExpense = Number(
    allTime.find((g) => g.type === "EXPENSE")?._sum.amount ?? 0
  );
  const totalBalance = totalIncome - totalExpense;

  const monthlyIncome = thisMonth
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const monthlyExpense = thisMonth
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const monthlySavings = monthlyIncome - monthlyExpense;

  const categoryTotals = new Map<string, number>();
  for (const t of thisMonth) {
    if (t.type !== "EXPENSE") continue;
    categoryTotals.set(
      t.category,
      (categoryTotals.get(t.category) ?? 0) + Number(t.amount)
    );
  }
  const pieData = Array.from(categoryTotals, ([category, amount]) => ({
    category,
    amount,
  }));

  const netWorth =
    totalBalance +
    investments.reduce((sum, i) => sum + Number(i.currentValue), 0);

  const insights = generateInsights(
    thisMonth.map((t) => ({
      type: t.type,
      amount: Number(t.amount),
      category: t.category,
    })),
    lastMonth.map((t) => ({
      type: t.type,
      amount: Number(t.amount),
      category: t.category,
    })),
    budgets.map((b) => ({
      category: b.category,
      monthlyLimit: Number(b.monthlyLimit),
      spent: categoryTotals.get(b.category) ?? 0,
    }))
  );

  const monthBuckets = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(now, 5 - i);
    return { key: format(d, "yyyy-MM"), label: format(d, "MMM") };
  });
  const barData = monthBuckets.map(({ key, label }) => {
    const income = sixMonthTransactions
      .filter((t) => t.type === "INCOME" && format(t.date, "yyyy-MM") === key)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = sixMonthTransactions
      .filter(
        (t) => t.type === "EXPENSE" && format(t.date, "yyyy-MM") === key
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { month: label, income, expense };
  });

  return (
    <div className="space-y-6">
      <h1 className="animate-fade-up text-2xl font-semibold">
        Welcome back{session?.user.name ? `, ${session.user.name}` : ""}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Net worth" value={netWorth} currency={currency} rate={rate} className="stagger-1" />
        <StatCard label="Cash balance" value={totalBalance} currency={currency} rate={rate} className="stagger-2" />
        <StatCard
          label="Monthly income"
          value={monthlyIncome}
          currency={currency}
          rate={rate}
          tone="positive"
          className="stagger-3"
        />
        <StatCard
          label="Monthly expenses"
          value={monthlyExpense}
          currency={currency}
          rate={rate}
          tone="negative"
          className="stagger-4"
        />
        <StatCard
          label="Monthly savings"
          value={monthlySavings}
          currency={currency}
          rate={rate}
          tone={monthlySavings >= 0 ? "positive" : "negative"}
          className="stagger-5"
        />
      </div>

      <InsightsPanel insights={insights} className="stagger-6" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-up stagger-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <h2 className="mb-4 text-sm font-semibold">
            Spending by category (this month)
          </h2>
          <CategoryPieChart data={pieData} currency={currency} rate={rate} />
        </div>

        <div className="animate-fade-up stagger-7 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <h2 className="mb-4 text-sm font-semibold">
            Income vs expense (last 6 months)
          </h2>
          <IncomeExpenseBarChart data={barData} currency={currency} rate={rate} />
        </div>
      </div>

      <div className="animate-fade-up stagger-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <h2 className="mb-4 text-sm font-semibold">Recent transactions</h2>
        {recentTransactions.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">
            No transactions yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentTransactions.map((t, i) => (
              <li
                key={t.id}
                className="animate-fade-up flex items-center justify-between py-3"
                style={{ animationDelay: `${480 + i * 60}ms` }}
              >
                <div>
                  <p className="text-sm font-medium">{t.category}</p>
                  <p className="text-xs text-gray-400">{formatDate(t.date)}</p>
                </div>
                <span
                  className={`text-sm font-medium tabular-nums ${
                    t.type === "INCOME" ? "text-emerald-600" : "text-gray-900"
                  }`}
                >
                  {t.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(Number(t.amount), currency, rate)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
