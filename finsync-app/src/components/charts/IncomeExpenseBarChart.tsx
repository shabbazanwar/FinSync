"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_INK, SERIES_EXPENSE, SERIES_INCOME } from "@/lib/chartColors";
import { formatCurrency } from "@/lib/format";

type MonthPoint = { month: string; income: number; expense: number };

export function IncomeExpenseBarChart({
  data,
  currency,
  rate,
}: {
  data: MonthPoint[];
  currency: string;
  rate: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid vertical={false} stroke={CHART_INK.gridline} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={{ stroke: CHART_INK.gridline }}
          tick={{ fontSize: 12, fill: CHART_INK.muted }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: CHART_INK.muted }}
          tickFormatter={(v: number) => formatCurrency(v, currency, rate)}
          width={90}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value), currency, rate)}
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            borderColor: CHART_INK.gridline,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar
          dataKey="income"
          name="Income"
          fill={SERIES_INCOME}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expense"
          name="Expense"
          fill={SERIES_EXPENSE}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
