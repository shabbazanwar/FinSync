import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { budgetSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  const now = new Date();
  const budgets = await prisma.budget.findMany({
    where: {
      userId: session.user.id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    },
    orderBy: { category: "asc" },
  });

  return Response.json(
    budgets.map((b) => ({ ...b, monthlyLimit: Number(b.monthlyLimit) }))
  );
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  const body = await request.json();
  const parsed = budgetSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  try {
    const budget = await prisma.budget.create({
      data: { ...parsed.data, userId: session.user.id },
    });
    return Response.json(
      { ...budget, monthlyLimit: Number(budget.monthlyLimit) },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { error: "A budget for this category and month already exists" },
      { status: 409 }
    );
  }
}
