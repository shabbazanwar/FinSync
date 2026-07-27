import { prisma } from "@/lib/prisma";
import { getExchangeRate } from "@/lib/exchangeRate";

export async function getDisplayCurrency(
  userId: string
): Promise<{ currency: string; rate: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currency: true, convertCurrency: true },
  });

  const currency = user?.currency ?? "NGN";
  const rate = user?.convertCurrency ? await getExchangeRate(currency) : 1;

  return { currency, rate };
}
