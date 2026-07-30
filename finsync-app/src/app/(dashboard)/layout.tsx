import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true },
  });

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} username={user?.username} />
      <main className="min-h-screen flex-1 overflow-y-auto p-4 pt-20 sm:p-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
