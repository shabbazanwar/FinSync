import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return new Response(null, { status: 401 });

  const { id } = await params;
  const existing = await prisma.notification.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return new Response(null, { status: 404 });
  }

  const body = await request.json();
  const notification = await prisma.notification.update({
    where: { id },
    data: { read: Boolean(body.read) },
  });

  return Response.json(notification);
}
