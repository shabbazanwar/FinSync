"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_INK, SERIES_INCOME } from "@/lib/chartColors";
import { formatCurrency } from "@/lib/format";
import type { ForecastPoint } from "@/lib/forecast";

export function ForecastChart({
  data,
  currency,
  rate,
}: {
  data: ForecastPoint[];
  currency: string;
  rate: number;
}) {
  const lastHistoricalIndex = data.findIndex((p) => p.projected) - 1;

  const chartData = data.map((p, i) => ({
    month: p.month,
    historical: p.projected ? null : p.balance,
    projected: p.projected || i === lastHistoricalIndex ? p.balance : null,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid vertical={false} stroke={CHART_INK.gridline} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={{ stroke: CHART_INK.gridline }}
          tick={{ fontSize: 11, fill: CHART_INK.muted }}
          interval="preserveStartEnd"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: CHART_INK.muted }}
          tickFormatter={(v: number) => formatCurrency(v, currency, rate)}
          width={90}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value), currency, rate), "Balance"]}
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            borderColor: CHART_INK.gridline,
          }}
        />
        <Line
          type="monotone"
          dataKey="historical"
          name="Actual"
          stroke={SERIES_INCOME}
          strokeWidth={2}
          dot={false}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey="projected"
          name="Projected"
          stroke={SERIES_INCOME}
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={false}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
