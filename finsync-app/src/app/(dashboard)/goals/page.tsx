import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GoalsManager } from "@/components/goals/GoalsManager";
import { getDisplayCurrency } from "@/lib/getUserCurrency";

export default async function GoalsPage() {
  const session = await auth();
  const { currency, rate } = await getDisplayCurrency(session!.user.id);
  const goals = await prisma.savingsGoal.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="animate-fade-up mb-6 text-2xl font-semibold">Savings goals</h1>
      <GoalsManager
        currency={currency}
        rate={rate}
        initialGoals={goals.map((g) => ({
          id: g.id,
          title: g.title,
          targetAmount: Number(g.targetAmount),
          currentAmount: Number(g.currentAmount),
          deadline: g.deadline ? g.deadline.toISOString() : null,
        }))}
      />
    </div>
  );
}
