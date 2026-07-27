import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { savingsGoalSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  const { id } = await params;
  const existing = await prisma.savingsGoal.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return new Response(null, { status: 404 });
  }

  const body = await request.json();
  const parsed = savingsGoalSchema.partial().safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const goal = await prisma.savingsGoal.update({
    where: { id },
    data: parsed.data,
  });

  return Response.json({
    ...goal,
    targetAmount: Number(goal.targetAmount),
    currentAmount: Number(goal.currentAmount),
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  const { id } = await params;
  const existing = await prisma.savingsGoal.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return new Response(null, { status: 404 });
  }

  await prisma.savingsGoal.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
