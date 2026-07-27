import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SettingsManager } from "@/components/settings/SettingsManager";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      username: true,
      email: true,
      currency: true,
      convertCurrency: true,
    },
  });
  // Session references a user that no longer exists in the DB (e.g. a
  // stale JWT after a dev-database reset) — the session itself is invalid.
  if (!user) redirect("/login");

  return (
    <div>
      <h1 className="animate-fade-up mb-6 text-2xl font-semibold">Settings</h1>
      <SettingsManager
        initialName={user.name}
        initialUsername={user.username}
        email={user.email}
        initialCurrency={user.currency}
        initialConvertCurrency={user.convertCurrency}
      />
    </div>
  );
}
