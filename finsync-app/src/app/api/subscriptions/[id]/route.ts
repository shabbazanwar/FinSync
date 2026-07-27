import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { subscriptionSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  const { id } = await params;
  const existing = await prisma.subscription.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return new Response(null, { status: 404 });
  }

  const body = await request.json();
  const parsed = subscriptionSchema.partial().safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const subscription = await prisma.subscription.update({
    where: { id },
    data: parsed.data,
  });

  return Response.json({ ...subscription, amount: Number(subscription.amount) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  const { id } = await params;
  const existing = await prisma.subscription.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return new Response(null, { status: 404 });
  }

  await prisma.subscription.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
