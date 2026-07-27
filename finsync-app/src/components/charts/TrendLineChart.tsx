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

type MonthPoint = { month: string; net: number };

export function TrendLineChart({
  data,
  currency,
  rate,
}: {
  data: MonthPoint[];
  currency: string;
  rate: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
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
          formatter={(value) => [formatCurrency(Number(value), currency, rate), "Net"]}
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            borderColor: CHART_INK.gridline,
          }}
        />
        <Line
          type="monotone"
          dataKey="net"
          name="Net savings"
          stroke={SERIES_INCOME}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
