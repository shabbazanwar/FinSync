import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SubscriptionsManager } from "@/components/subscriptions/SubscriptionsManager";
import { getDisplayCurrency } from "@/lib/getUserCurrency";

export default async function SubscriptionsPage() {
  const session = await auth();
  const { currency, rate } = await getDisplayCurrency(session!.user.id);
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session!.user.id },
    orderBy: { nextBillingDate: "asc" },
  });

  return (
    <div>
      <h1 className="animate-fade-up mb-6 text-2xl font-semibold">Subscriptions</h1>
      <SubscriptionsManager
        currency={currency}
        rate={rate}
        initialSubscriptions={subscriptions.map((s) => ({
          id: s.id,
          name: s.name,
          amount: Number(s.amount),
          billingCycle: s.billingCycle,
          nextBillingDate: s.nextBillingDate.toISOString(),
          category: s.category,
          active: s.active,
        }))}
      />
    </div>
  );
}
