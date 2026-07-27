export type InsightTone = "positive" | "warning" | "neutral";
export type Insight = { message: string; tone: InsightTone };

type TransactionLite = {
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
};

type BudgetLite = {
  category: string;
  monthlyLimit: number;
  spent: number;
};

function sumByCategory(transactions: TransactionLite[]) {
  const totals = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "EXPENSE") continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  return totals;
}

/**
 * Deterministic, template-generated insights from real spending data —
 * no external AI call, so the feature works without an API key.
 */
export function generateInsights(
  thisMonth: TransactionLite[],
  lastMonth: TransactionLite[],
  budgets: BudgetLite[]
): Insight[] {
  const insights: Insight[] = [];

  for (const budget of budgets) {
    const pct = budget.spent / budget.monthlyLimit;
    if (pct >= 1) {
      insights.push({
        message: `You're over budget on ${budget.category} this month.`,
        tone: "warning",
      });
    } else if (pct >= 0.9) {
      insights.push({
        message: `You've used ${Math.round(pct * 100)}% of your ${budget.category} budget this month.`,
        tone: "warning",
      });
    }
  }

  const thisTotals = sumByCategory(thisMonth);
  const lastTotals = sumByCategory(lastMonth);
  for (const [category, current] of thisTotals) {
    const previous = lastTotals.get(category);
    if (!previous || previous <= 0) continue;
    const delta = ((current - previous) / previous) * 100;
    if (Math.abs(delta) >= 20) {
      insights.push({
        message: `You spent ${Math.round(Math.abs(delta))}% ${delta > 0 ? "more" : "less"} on ${category} this month than last month.`,
        tone: delta > 0 ? "warning" : "positive",
      });
    }
  }

  const income = thisMonth
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = thisMonth
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);
  if (income > 0 && income > expense) {
    insights.push({
      message: `You're on track to save this month — income is ahead of expenses so far.`,
      tone: "positive",
    });
  }

  return insights.slice(0, 4);
}
