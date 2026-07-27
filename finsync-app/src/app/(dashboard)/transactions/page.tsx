import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TransactionsManager } from "@/components/transactions/TransactionsManager";
import { getDisplayCurrency } from "@/lib/getUserCurrency";

export default async function TransactionsPage() {
  const session = await auth();
  const { currency, rate } = await getDisplayCurrency(session!.user.id);
  const transactions = await prisma.transaction.findMany({
    where: { userId: session!.user.id },
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <h1 className="animate-fade-up mb-6 text-2xl font-semibold">Transactions</h1>
      <TransactionsManager
        currency={currency}
        rate={rate}
        initialTransactions={transactions.map((t) => ({
          id: t.id,
          type: t.type,
          amount: Number(t.amount),
          category: t.category,
          note: t.note,
          date: t.date.toISOString(),
        }))}
      />
    </div>
  );
}
