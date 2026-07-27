import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildForecast } from "@/lib/forecast";
import { ForecastChart } from "@/components/charts/ForecastChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { getDisplayCurrency } from "@/lib/getUserCurrency";

export default async function ForecastPage() {
  const session = await auth();
  const userId = session!.user.id;
  const { currency, rate } = await getDisplayCurrency(userId);

  const [transactions, subscriptions] = await Promise.all([
    prisma.transaction.findMany({ where: { userId } }),
    prisma.subscription.findMany({ where: { userId, active: true } }),
  ]);

  const points = buildForecast(
    transactions.map((t) => ({
      type: t.type,
      amount: Number(t.amount),
      date: t.date,
    })),
    subscriptions.map((s) => ({
      amount: Number(s.amount),
      billingCycle: s.billingCycle,
    })),
    new Date()
  );

  const projectedIn12Months = points[points.length - 1]?.balance ?? 0;
  const currentBalance =
    points.find((p) => !p.projected)?.balance ?? 0;
  const lastHistorical = [...points].reverse().find((p) => !p.projected);

  return (
    <div className="space-y-6">
      <h1 className="animate-fade-up text-2xl font-semibold">Forecast</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Current balance"
          value={lastHistorical?.balance ?? currentBalance}
          currency={currency}
          rate={rate}
          className="stagger-1"
        />
        <StatCard
          label="Projected balance in 12 months"
          value={projectedIn12Months}
          currency={currency}
          rate={rate}
          tone={projectedIn12Months >= (lastHistorical?.balance ?? 0) ? "positive" : "negative"}
          className="stagger-2"
        />
      </div>

      <div className="animate-fade-up stagger-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <h2 className="mb-1 text-sm font-semibold">Projected balance</h2>
        <p className="mb-4 text-xs text-gray-400">
          Based on your trailing 3-month average income and expenses, plus
          active subscriptions.
        </p>
        <ForecastChart data={points} currency={currency} rate={rate} />
      </div>
    </div>
  );
}
