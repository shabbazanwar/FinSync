import { format, startOfMonth, subMonths } from "date-fns";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { IncomeExpenseBarChart } from "@/components/charts/IncomeExpenseBarChart";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { getDisplayCurrency } from "@/lib/getUserCurrency";

export default async function AnalyticsPage() {
  const session = await auth();
  const userId = session!.user.id;
  const { currency, rate } = await getDisplayCurrency(userId);

  const now = new Date();
  const twelveMonthsAgo = startOfMonth(subMonths(now, 11));

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: twelveMonthsAgo } },
  });

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  const categoryTotals = new Map<string, number>();
  for (const t of transactions) {
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

  const monthBuckets = Array.from({ length: 12 }, (_, i) => {
    const d = subMonths(now, 11 - i);
    return { key: format(d, "yyyy-MM"), label: format(d, "MMM") };
  });
  const monthlySeries = monthBuckets.map(({ key, label }) => {
    const income = transactions
      .filter((t) => t.type === "INCOME" && format(t.date, "yyyy-MM") === key)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = transactions
      .filter(
        (t) => t.type === "EXPENSE" && format(t.date, "yyyy-MM") === key
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { month: label, income, expense, net: income - expense };
  });

  return (
    <div className="space-y-6">
      <h1 className="animate-fade-up text-2xl font-semibold">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Income (12 months)"
          value={totalIncome}
          currency={currency}
          rate={rate}
          tone="positive"
          className="stagger-1"
        />
        <StatCard
          label="Expenses (12 months)"
          value={totalExpense}
          currency={currency}
          rate={rate}
          tone="negative"
          className="stagger-2"
        />
        <StatCard
          label={`Net savings — ${savingsRate.toFixed(0)}% of income`}
          value={netSavings}
          currency={currency}
          rate={rate}
          tone={netSavings >= 0 ? "positive" : "negative"}
          className="stagger-3"
        />
      </div>

      <div className="animate-fade-up stagger-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <h2 className="mb-4 text-sm font-semibold">Spending trend</h2>
        <TrendLineChart
          data={monthlySeries.map(({ month, net }) => ({ month, net }))}
          currency={currency}
          rate={rate}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-up stagger-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <h2 className="mb-4 text-sm font-semibold">
            Spending by category (12 months)
          </h2>
          <CategoryPieChart data={pieData} currency={currency} rate={rate} />
        </div>

        <div className="animate-fade-up stagger-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <h2 className="mb-4 text-sm font-semibold">Income vs expense</h2>
          <IncomeExpenseBarChart
            data={monthlySeries.map(({ month, income, expense }) => ({
              month,
              income,
              expense,
            }))}
            currency={currency}
            rate={rate}
          />
        </div>
      </div>
    </div>
  );
}
