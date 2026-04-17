const endpoints = [
  {
    name: "Japan Weather",
    path: "/api/weather/{city}",
    example: "/api/weather/tokyo",
    price: "$0.001 USDC",
    network: "Base Sepolia",
    description: "Current weather for Japanese cities: temperature, humidity, wind speed.",
    params: "city: tokyo | osaka | kyoto | fukuoka | sapporo",
    source: "Open-Meteo (no API key required)",
    color: "#3b82f6",
  },
  {
    name: "JPY Exchange Rates",
    path: "/api/fx/{pair}",
    example: "/api/fx/USDJPY",
    price: "$0.001 USDC",
    network: "Base Sepolia",
    description: "Real-time JPY exchange rates with daily change.",
    params: "pair: USDJPY | EURJPY | GBPJPY",
    source: "ExchangeRate-API (free tier)",
    color: "#10b981",
  },
  {
    name: "APAC Crypto News",
    path: "/api/news/apac",
    example: "/api/news/apac",
    price: "$0.005 USDC",
    network: "Base Sepolia",
    description: "Latest 10 crypto headlines from Japan, Korea, China, Singapore with sentiment scores.",
    params: "none",
    source: "CryptoPanic API (free tier)",
    color: "#f59e0b",
  },
  {
    name: "TSE Stock Data",
    path: "/api/stocks/{ticker}",
    example: "/api/stocks/7203.T",
    price: "$0.01 USDC",
    network: "Base Sepolia",
    description: "Tokyo Stock Exchange data: price, volume, PER.",
    params: "ticker: e.g. 7203.T (Toyota), 9984.T (SoftBank)",
    source: "Yahoo Finance (unofficial)",
    color: "#ef4444",
  },
];

export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <header style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 8px" }}>
          🇯🇵 Japan x402 APIs
        </h1>
        <p style={{ color: "#9ca3af", margin: 0, fontSize: 16 }}>
          Japan &amp; APAC data APIs with x402 micropayment gating on{" "}
          <span style={{ color: "#6366f1" }}>Base Sepolia</span>
        </p>
      </header>

      <div style={{ display: "grid", gap: 24 }}>
        {endpoints.map((ep) => (
          <div
            key={ep.path}
            style={{
              border: `1px solid ${ep.color}40`,
              borderRadius: 12,
              padding: 24,
              background: "#1a1a1a",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                {ep.name}
              </h2>
              <span
                style={{
                  background: `${ep.color}20`,
                  color: ep.color,
                  border: `1px solid ${ep.color}60`,
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {ep.price}
              </span>
            </div>

            <p style={{ color: "#9ca3af", margin: "8px 0 16px", fontSize: 14 }}>
              {ep.description}
            </p>

            <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
              <div>
                <span style={{ color: "#6b7280" }}>Endpoint: </span>
                <code style={{ color: "#e5e7eb", background: "#262626", padding: "2px 8px", borderRadius: 4 }}>
                  GET {ep.path}
                </code>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Example: </span>
                <code style={{ color: "#a5f3fc", background: "#262626", padding: "2px 8px", borderRadius: 4 }}>
                  curl -i localhost:3000{ep.example}
                </code>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Params: </span>
                <span style={{ color: "#d1d5db" }}>{ep.params}</span>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Network: </span>
                <span style={{ color: "#d1d5db" }}>{ep.network}</span>
              </div>
              <div>
                <span style={{ color: "#6b7280" }}>Source: </span>
                <span style={{ color: "#d1d5db" }}>{ep.source}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: 48, borderTop: "1px solid #262626", paddingTop: 24, color: "#4b5563", fontSize: 13 }}>
        <p style={{ margin: "0 0 8px" }}>
          Bazaar manifest:{" "}
          <code style={{ color: "#6b7280" }}>GET /.well-known/x402.json</code>
        </p>
        <p style={{ margin: 0 }}>
          Built on{" "}
          <a href="https://x402.org" style={{ color: "#6366f1" }}>
            x402 protocol
          </a>{" "}
          · Powered by{" "}
          <a href="https://www.coinbase.com/developer-platform" style={{ color: "#6366f1" }}>
            Coinbase CDP
          </a>
        </p>
      </footer>
    </main>
  );
}
