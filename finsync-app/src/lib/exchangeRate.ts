// FinSync assumes all raw amounts are entered in Naira — there's no
// per-record currency on Transaction/Budget/etc. — so conversion always
// starts from this fixed base. See the "convert amounts" note in Settings.
const BASE_CURRENCY = "NGN";

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours — rates update daily upstream
const rateCache = new Map<string, { rate: number; fetchedAt: number }>();

/**
 * Returns the multiplier to convert a BASE_CURRENCY amount into `to`.
 * Falls back to 1 (no conversion) on any failure — a third-party FX API
 * being down must never break the app.
 */
export async function getExchangeRate(to: string): Promise<number> {
  if (to === BASE_CURRENCY) return 1;

  const cached = rateCache.get(to);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.rate;
  }

  try {
    const res = await fetch(
      `https://open.er-api.com/v6/latest/${BASE_CURRENCY}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) throw new Error(`Exchange rate API returned ${res.status}`);

    const data = await res.json();
    const rate = data?.rates?.[to];
    if (typeof rate !== "number") {
      throw new Error(`No rate found for ${to}`);
    }

    rateCache.set(to, { rate, fetchedAt: Date.now() });
    return rate;
  } catch (err) {
    console.error("getExchangeRate failed, falling back to 1:", err);
    return 1;
  }
}
