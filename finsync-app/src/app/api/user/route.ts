import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userSettingsSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  const body = await request.json();
  const parsed = userSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
      select: {
        name: true,
        username: true,
        email: true,
        currency: true,
        convertCurrency: true,
      },
    });

    return Response.json(user);
  } catch {
    return Response.json(
      { error: "That username is already taken" },
      { status: 409 }
    );
  }
}
