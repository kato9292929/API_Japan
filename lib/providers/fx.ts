const SUPPORTED_PAIRS = ["USDJPY", "EURJPY", "GBPJPY"] as const;
type SupportedPair = (typeof SUPPORTED_PAIRS)[number];

const BASE_CURRENCIES: Record<SupportedPair, string> = {
  USDJPY: "USD",
  EURJPY: "EUR",
  GBPJPY: "GBP",
};

export interface FxData {
  pair: string;
  base: string;
  quote: string;
  rate: number;
  previous_rate: number | null;
  change: number | null;
  change_pct: number | null;
  timestamp: string;
  source: string;
}

export async function fetchFxRate(pair: string): Promise<FxData> {
  const upperPair = pair.toUpperCase();

  if (!SUPPORTED_PAIRS.includes(upperPair as SupportedPair)) {
    throw new Error(
      `Unsupported pair: ${pair}. Supported: ${SUPPORTED_PAIRS.join(", ")}`
    );
  }

  const base = BASE_CURRENCIES[upperPair as SupportedPair];

  const url = `https://open.er-api.com/v6/latest/${base}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`ExchangeRate-API error: ${res.status}`);
  }

  const data = await res.json();

  if (data.result !== "success") {
    throw new Error(`ExchangeRate-API: ${data["error-type"] ?? "unknown error"}`);
  }

  const rate: number = data.rates["JPY"];

  return {
    pair: upperPair,
    base,
    quote: "JPY",
    rate,
    previous_rate: null,
    change: null,
    change_pct: null,
    timestamp: data.time_last_update_utc ?? new Date().toISOString(),
    source: "open.er-api.com",
  };
}
