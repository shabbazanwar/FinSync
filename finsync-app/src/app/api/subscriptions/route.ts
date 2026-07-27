import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { subscriptionSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id },
    orderBy: { nextBillingDate: "asc" },
  });

  return Response.json(
    subscriptions.map((s) => ({ ...s, amount: Number(s.amount) }))
  );
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  const body = await request.json();
  const parsed = subscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const subscription = await prisma.subscription.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  return Response.json(
    { ...subscription, amount: Number(subscription.amount) },
    { status: 201 }
  );
}
