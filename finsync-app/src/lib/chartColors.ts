import { EXPENSE_CATEGORIES } from "@/lib/categories";

// Fixed categorical order (validated palette) — color follows the entity
// (its position in EXPENSE_CATEGORIES), never its rank in a given chart.
const CATEGORICAL = [
  "#2a78d6", // blue
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#e87ba4", // magenta
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
];

const categoryColorMap = new Map<string, string>(
  EXPENSE_CATEGORIES.map((category, i) => [category, CATEGORICAL[i]])
);

export function colorForCategory(category: string) {
  return categoryColorMap.get(category) ?? "#898781"; // muted fallback
}

const INVESTMENT_TYPES = [
  "STOCK",
  "ETF",
  "MUTUAL_FUND",
  "CRYPTO",
  "REAL_ESTATE",
  "OTHER",
] as const;

const investmentTypeColorMap = new Map<string, string>(
  INVESTMENT_TYPES.map((type, i) => [type, CATEGORICAL[i]])
);

export function colorForInvestmentType(type: string) {
  return investmentTypeColorMap.get(type) ?? "#898781";
}

export const SERIES_INCOME = CATEGORICAL[0]; // blue
export const SERIES_EXPENSE = CATEGORICAL[1]; // orange

export const CHART_INK = {
  primary: "#0b0b0b",
  secondary: "#52514e",
  muted: "#898781",
  gridline: "#e1e0d9",
  surface: "#fcfcfb",
};
