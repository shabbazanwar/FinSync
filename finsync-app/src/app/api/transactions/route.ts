import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const search = searchParams.get("search");

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      ...(category ? { category } : {}),
      ...(type === "INCOME" || type === "EXPENSE" ? { type } : {}),
      ...(search
        ? {
            OR: [
              { category: { contains: search, mode: "insensitive" } },
              { note: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { date: "desc" },
  });

  return Response.json(
    transactions.map((t) => ({ ...t, amount: Number(t.amount) }))
  );
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  const body = await request.json();
  const parsed = transactionSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const transaction = await prisma.transaction.create({
    data: { ...parsed.data, userId: session.user.id },
  });

  return Response.json(
    { ...transaction, amount: Number(transaction.amount) },
    { status: 201 }
  );
}
