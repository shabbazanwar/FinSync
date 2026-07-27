import { HiOutlineSparkles } from "react-icons/hi";
import type { Insight } from "@/lib/insights";

const TONE_BORDER: Record<Insight["tone"], string> = {
  positive: "border-l-emerald-500",
  warning: "border-l-amber-500",
  neutral: "border-l-gray-300",
};

export function InsightsPanel({
  insights,
  className = "",
}: {
  insights: Insight[];
  className?: string;
}) {
  if (insights.length === 0) return null;

  return (
    <div
      className={`animate-fade-up rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}
    >
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <HiOutlineSparkles className="h-4 w-4 text-emerald-600" />
        Insights
      </h2>
      <ul className="space-y-2">
        {insights.map((insight, i) => (
          <li
            key={i}
            className={`animate-fade-up rounded-r-lg border-l-4 bg-gray-50 py-2 pr-3 pl-3 text-sm text-gray-700 ${TONE_BORDER[insight.tone]}`}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            {insight.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
