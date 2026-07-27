import { addMonths, endOfMonth, format, subMonths } from "date-fns";
import { toMonthlyCost, type BillingCycle } from "@/lib/subscriptions";

type TransactionLite = {
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: Date;
};

type SubscriptionLite = {
  amount: number;
  billingCycle: BillingCycle;
};

export type ForecastPoint = {
  month: string;
  balance: number;
  projected: boolean;
};

/**
 * Historical balance is the true running total of every transaction up to
 * each month-end. The projection then assumes the trailing-3-month average
 * income/expense run-rate continues, plus known active subscription costs —
 * a deliberate simplification (some of that subscription cost may already
 * be reflected in historical averages) rather than reconciling subscriptions
 * against past transactions one by one.
 */
export function buildForecast(
  allTransactions: TransactionLite[],
  activeSubscriptions: SubscriptionLite[],
  now: Date,
  monthsBack = 6,
  monthsAhead = 12
): ForecastPoint[] {
  const points: ForecastPoint[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const boundary = endOfMonth(subMonths(now, i));
    const balance = allTransactions
      .filter((t) => t.date <= boundary)
      .reduce((sum, t) => sum + (t.type === "INCOME" ? t.amount : -t.amount), 0);
    points.push({ month: format(boundary, "MMM ''yy"), balance, projected: false });
  }

  const trailingStart = subMonths(now, 3);
  const trailing = allTransactions.filter((t) => t.date >= trailingStart);
  const avgIncome =
    trailing.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0) / 3;
  const avgExpense =
    trailing.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0) / 3;
  const monthlySubscriptionCost = activeSubscriptions.reduce(
    (sum, s) => sum + toMonthlyCost(s.amount, s.billingCycle),
    0
  );
  const monthlyNet = avgIncome - avgExpense - monthlySubscriptionCost;

  let runningBalance = points[points.length - 1]?.balance ?? 0;
  for (let i = 1; i <= monthsAhead; i++) {
    runningBalance += monthlyNet;
    const boundary = endOfMonth(addMonths(now, i));
    points.push({
      month: format(boundary, "MMM ''yy"),
      balance: runningBalance,
      projected: true,
    });
  }

  return points;
}
