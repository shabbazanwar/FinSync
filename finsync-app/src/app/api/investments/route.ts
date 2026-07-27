import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { investmentSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  const investments = await prisma.investment.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(
    investments.map((i) => ({
      ...i,
      costBasis: Number(i.costBasis),
      currentValue: Number(i.currentValue),
    }))
  );
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  const body = await request.json();
  const parsed = investmentSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const investment = await prisma.investment.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  return Response.json(
    {
      ...investment,
      costBasis: Number(investment.costBasis),
      currentValue: Number(investment.currentValue),
    },
    { status: 201 }
  );
}
