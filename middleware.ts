import { paymentMiddleware } from "x402/next";

const FACILITATOR_URL =
  process.env.FACILITATOR_URL ?? "https://x402.org/facilitator";

const WALLET_ADDRESS = (process.env.WALLET_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const middleware = paymentMiddleware(WALLET_ADDRESS, {
  "/api/weather/:city*": {
    price: "$0.001",
    network: "base-sepolia",
    config: {
      description: "Japan Weather Data - temperature, humidity, wind speed",
      mimeType: "application/json",
    },
  },
  "/api/fx/:pair*": {
    price: "$0.001",
    network: "base-sepolia",
    config: {
      description: "JPY Exchange Rates - USDJPY, EURJPY, GBPJPY",
      mimeType: "application/json",
    },
  },
  "/api/news/apac": {
    price: "$0.005",
    network: "base-sepolia",
    config: {
      description: "APAC Crypto News - latest 10 headlines with sentiment",
      mimeType: "application/json",
    },
  },
  "/api/stocks/:ticker*": {
    price: "$0.01",
    network: "base-sepolia",
    config: {
      description: "TSE Stock Data - price, volume, PER",
      mimeType: "application/json",
    },
  },
}, {
  url: FACILITATOR_URL,
});

export const config = {
  matcher: [
    "/api/weather/:path*",
    "/api/fx/:path*",
    "/api/news/apac",
    "/api/stocks/:path*",
  ],
};
