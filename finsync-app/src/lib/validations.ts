import { z } from "zod";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

const currencyCodes = SUPPORTED_CURRENCIES.map((c) => c.code) as [
  string,
  ...string[],
];

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );

export const signInSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  username: usernameSchema,
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain a letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().positive(),
  category: z.string().trim().min(1),
  note: z.string().trim().optional(),
  date: z.coerce.date(),
});

export const budgetSchema = z.object({
  category: z.string().trim().min(1),
  monthlyLimit: z.number().positive(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
});

export const savingsGoalSchema = z.object({
  title: z.string().trim().min(1),
  targetAmount: z.number().positive(),
  currentAmount: z.number().nonnegative().optional(),
  deadline: z.coerce.date().optional(),
});

export const subscriptionSchema = z.object({
  name: z.string().trim().min(1),
  amount: z.number().positive(),
  billingCycle: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]),
  nextBillingDate: z.coerce.date(),
  category: z.string().trim().min(1),
  active: z.boolean().optional(),
});

export const investmentSchema = z.object({
  name: z.string().trim().min(1),
  type: z.enum(["STOCK", "ETF", "MUTUAL_FUND", "CRYPTO", "REAL_ESTATE", "OTHER"]),
  costBasis: z.number().positive(),
  currentValue: z.number().nonnegative(),
});

export const userSettingsSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  username: usernameSchema.optional(),
  currency: z.enum(currencyCodes),
  convertCurrency: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain a letter")
    .regex(/[0-9]/, "Password must contain a number"),
});
