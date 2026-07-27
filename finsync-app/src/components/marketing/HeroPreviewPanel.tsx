"use client";

import { motion } from "motion/react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

// Matches the real in-app category color mapping (src/lib/chartColors.ts) —
// this mockup should look like the actual product, not an invented one.
const CATEGORY_SEGMENTS = [
  { name: "Food", pct: 38, color: "#2a78d6" },
  { name: "Transport", pct: 24, color: "#eb6834" },
  { name: "Rent", pct: 20, color: "#1baf7a" },
  { name: "Bills", pct: 18, color: "#eda100" },
];

export function HeroPreviewPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="mx-auto w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-sm"
    >
      <div className="overflow-hidden rounded-xl bg-white shadow-inner">
        <div className="flex items-center gap-1.5 border-b border-gray-100 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-[10px] text-gray-400">Total balance</p>
              <p className="text-sm font-semibold text-gray-900">₦482,300</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-[10px] text-gray-400">Monthly savings</p>
              <p className="text-sm font-semibold text-emerald-600">₦64,100</p>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-3">
            <p className="mb-1 text-[10px] text-gray-400">
              Spending by category
            </p>
            <div className="flex items-center gap-3">
              <div className="h-20 w-20 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_SEGMENTS}
                      dataKey="pct"
                      nameKey="name"
                      innerRadius={22}
                      outerRadius={38}
                      paddingAngle={2}
                      stroke="#f9fafb"
                      strokeWidth={2}
                      isAnimationActive
                      animationDuration={800}
                      animationBegin={500}
                    >
                      {CATEGORY_SEGMENTS.map((seg) => (
                        <Cell key={seg.name} fill={seg.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="grid flex-1 grid-cols-2 gap-x-2 gap-y-1">
                {CATEGORY_SEGMENTS.map((seg) => (
                  <li
                    key={seg.name}
                    className="flex items-center gap-1.5 text-[10px] text-gray-600"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: seg.color }}
                    />
                    {seg.name} <span className="text-gray-400">{seg.pct}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-[10px] text-gray-400">Savings goal</p>
            <p className="mb-1.5 text-xs font-medium text-gray-700">
              Emergency Fund — 64%
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
              <motion.span
                className="block h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: "64%" }}
                transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
