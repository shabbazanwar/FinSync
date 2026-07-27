"use client";

import { motion } from "motion/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";

const BUDGET_ROWS = [
  { category: "Food", pct: 82, color: "#1baf7a" },
  { category: "Transport", pct: 45, color: "#1baf7a" },
  { category: "Bills", pct: 104, color: "#e34948" },
];

export function BudgetSpotlightMockup() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
      <p className="mb-4 text-xs font-medium text-gray-400">
        Budgets — this month
      </p>
      <div className="space-y-4">
        {BUDGET_ROWS.map((row, i) => (
          <div key={row.category}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-900">{row.category}</span>
              <span
                className={row.pct > 100 ? "text-red-600" : "text-gray-500"}
              >
                {row.pct}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: row.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(row.pct, 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const FORECAST_DATA = [
  { month: "Mar", historical: 120000, projected: null },
  { month: "Apr", historical: 165000, projected: null },
  { month: "May", historical: 190000, projected: null },
  { month: "Jun", historical: 240000, projected: 240000 },
  { month: "Jul", historical: null, projected: 310000 },
  { month: "Aug", historical: null, projected: 380000 },
  { month: "Sep", historical: null, projected: 450000 },
];

export function ForecastSpotlightMockup() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
      <p className="mb-1 text-xs font-medium text-gray-400">
        Projected balance
      </p>
      <p className="mb-4 text-lg font-semibold text-gray-900">₦450,000</p>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={FORECAST_DATA} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e1e0d9" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#898781" }}
            />
            <Line
              type="monotone"
              dataKey="historical"
              stroke="#2a78d6"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#2a78d6"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive
              animationDuration={800}
              animationBegin={400}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
