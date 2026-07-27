export type BillingCycle = "WEEKLY" | "MONTHLY" | "YEARLY";

// Normalizes any billing cycle to an equivalent monthly cost.
export function toMonthlyCost(amount: number, cycle: BillingCycle) {
  if (cycle === "WEEKLY") return amount * 4.33;
  if (cycle === "YEARLY") return amount / 12;
  return amount;
}
