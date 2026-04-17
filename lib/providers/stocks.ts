export interface StockData {
  ticker: string;
  name: string;
  price: number;
  currency: string;
  change: number;
  change_pct: number;
  volume: number;
  market_cap: number | null;
  per: number | null;
  exchange: string;
  timestamp: string;
  note?: string;
}

const TSE_NAMES: Record<string, string> = {
  "7203.T": "Toyota Motor Corporation",
  "9984.T": "SoftBank Group Corp",
  "6758.T": "Sony Group Corporation",
  "6861.T": "Keyence Corporation",
  "8306.T": "Mitsubishi UFJ Financial Group",
  "9432.T": "Nippon Telegraph and Telephone",
  "4063.T": "Shin-Etsu Chemical",
  "6367.T": "Daikin Industries",
  "8035.T": "Tokyo Electron Limited",
  "7974.T": "Nintendo Co., Ltd.",
};

export async function fetchStockData(ticker: string): Promise<StockData> {
  const upperTicker = ticker.toUpperCase();

  if (!upperTicker.endsWith(".T") && !upperTicker.endsWith(".TYO")) {
    throw new Error(
      `Invalid TSE ticker format. Use format like 7203.T or 9984.T`
    );
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(upperTicker)}?interval=1d&range=1d`;

    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; japan-x402-apis/1.0)",
      },
    });

    if (!res.ok) {
      throw new Error(`Yahoo Finance error: ${res.status}`);
    }

    const data = await res.json();
    const result = data?.chart?.result?.[0];

    if (!result) {
      throw new Error(`No data found for ticker: ${upperTicker}`);
    }

    const meta = result.meta;
    const price: number = meta.regularMarketPrice;
    const prevClose: number = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = price - prevClose;
    const changePct = prevClose > 0 ? (change / prevClose) * 100 : 0;

    return {
      ticker: upperTicker,
      name: TSE_NAMES[upperTicker] ?? meta.longName ?? meta.shortName ?? upperTicker,
      price,
      currency: meta.currency ?? "JPY",
      change: Math.round(change * 100) / 100,
      change_pct: Math.round(changePct * 100) / 100,
      volume: meta.regularMarketVolume ?? 0,
      market_cap: meta.marketCap ?? null,
      per: null,
      exchange: "Tokyo Stock Exchange",
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    if (err instanceof Error && err.message.includes("Yahoo Finance")) {
      throw err;
    }
    return getMockStockData(upperTicker);
  }
}

function getMockStockData(ticker: string): StockData {
  const mockPrices: Record<string, number> = {
    "7203.T": 2800,
    "9984.T": 7500,
    "6758.T": 13200,
    "6861.T": 58000,
    "8306.T": 1200,
    "9432.T": 3200,
    "4063.T": 5600,
    "6367.T": 19000,
    "8035.T": 31000,
    "7974.T": 6200,
  };

  const price = mockPrices[ticker] ?? 1000;
  const change = (Math.random() - 0.5) * price * 0.03;

  return {
    ticker,
    name: TSE_NAMES[ticker] ?? ticker,
    price,
    currency: "JPY",
    change: Math.round(change * 100) / 100,
    change_pct: Math.round((change / price) * 10000) / 100,
    volume: Math.floor(Math.random() * 5000000) + 500000,
    market_cap: null,
    per: Math.round((15 + Math.random() * 20) * 10) / 10,
    exchange: "Tokyo Stock Exchange",
    timestamp: new Date().toISOString(),
    note: "Mock data - set up Yahoo Finance access or provide real data source",
  };
}
