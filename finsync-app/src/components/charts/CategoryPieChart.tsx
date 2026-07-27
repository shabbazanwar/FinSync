"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { colorForCategory, CHART_INK } from "@/lib/chartColors";
import { formatCurrency } from "@/lib/format";

type Slice = { category: string; amount: number };

export function CategoryPieChart({
  data,
  currency,
  rate,
}: {
  data: Slice[];
  currency: string;
  rate: number;
}) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  if (data.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-400">
        No expenses in this period yet.
      </p>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            stroke={CHART_INK.surface}
            strokeWidth={2}
          >
            {data.map((d) => (
              <Cell key={d.category} fill={colorForCategory(d.category)} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              formatCurrency(Number(value), currency, rate),
              String(name),
            ]}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              borderColor: CHART_INK.gridline,
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <ul className="mt-2 space-y-1.5">
        {data
          .slice()
          .sort((a, b) => b.amount - a.amount)
          .map((d) => (
            <li
              key={d.category}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 text-gray-600">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: colorForCategory(d.category) }}
                />
                {d.category}
              </span>
              <span className="text-gray-900">
                {formatCurrency(d.amount, currency, rate)}{" "}
                <span className="text-gray-400">
                  ({total > 0 ? Math.round((d.amount / total) * 100) : 0}%)
                </span>
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}
