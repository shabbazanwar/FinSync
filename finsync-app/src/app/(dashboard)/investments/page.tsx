import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { InvestmentsManager } from "@/components/investments/InvestmentsManager";
import { getDisplayCurrency } from "@/lib/getUserCurrency";

export default async function InvestmentsPage() {
  const session = await auth();
  const { currency, rate } = await getDisplayCurrency(session!.user.id);
  const investments = await prisma.investment.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="animate-fade-up mb-6 text-2xl font-semibold">Investments</h1>
      <InvestmentsManager
        currency={currency}
        rate={rate}
        initialInvestments={investments.map((i) => ({
          id: i.id,
          name: i.name,
          type: i.type,
          costBasis: Number(i.costBasis),
          currentValue: Number(i.currentValue),
        }))}
      />
    </div>
  );
}
