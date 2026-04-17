# 🇯🇵 Japan x402 APIs

Japan & APAC data APIs with **x402 micropayment gating** on Base Sepolia.

Built with [Next.js](https://nextjs.org), [x402-next](https://github.com/coinbase/x402), and [Coinbase CDP](https://docs.cdp.coinbase.com).

## Live Demo

> Deployed on Vercel: **[TODO: Add Vercel URL after deployment]**

---

## API Endpoints

| Endpoint | Price | Description |
|---|---|---|
| `GET /api/weather/{city}` | $0.001 USDC | Current weather (temp, humidity, wind) |
| `GET /api/fx/{pair}` | $0.001 USDC | JPY exchange rates |
| `GET /api/news/apac` | $0.005 USDC | APAC crypto news with sentiment |
| `GET /api/stocks/{ticker}` | $0.01 USDC | TSE stock data |

All endpoints return `402 Payment Required` until a valid x402 payment header is provided.

---

## Quick Start (GitHub Codespaces)

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/kato9292929/API_Japan)

**Codespaces で始める手順：**

1. 上のバッジをクリック → Codespace が自動起動（`npm install` まで自動実行）
2. ターミナルで `.env.local` にウォレットアドレスを設定：
   ```bash
   echo "WALLET_ADDRESS=0xYourWalletAddress" >> .env.local
   ```
3. 開発サーバーを起動：
   ```bash
   npm run dev
   ```
4. Codespace が自動的にポート 3000 を転送してブラウザで開きます

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/japan-x402-apis
cd japan-x402-apis
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
WALLET_ADDRESS=0xYourWalletAddressHere
FACILITATOR_URL=https://x402.org/facilitator
CRYPTOPANIC_API_TOKEN=your_token_here  # optional
```

### 3. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the API catalog.

---

## Testing Endpoints

### Check 402 response (no payment)

```bash
# Weather - should return 402 Payment Required
curl -i localhost:3000/api/weather/tokyo

# FX rate - should return 402 Payment Required
curl -i localhost:3000/api/fx/USDJPY

# Crypto news - should return 402 Payment Required
curl -i localhost:3000/api/news/apac

# Stock data - should return 402 Payment Required
curl -i localhost:3000/api/stocks/7203.T
```

### Check Bazaar manifest

```bash
curl localhost:3000/.well-known/x402.json | jq .
```

### Make a paid request (using x402 client)

```bash
# Install the x402 CLI
npm install -g x402-cli

# Fund your testnet wallet with USDC on Base Sepolia
# https://faucet.circle.com (select "Base Sepolia")

# Fetch with payment
x402 fetch http://localhost:3000/api/weather/tokyo \
  --private-key YOUR_PRIVATE_KEY
```

### Supported parameters

**Weather cities:** `tokyo`, `osaka`, `kyoto`, `fukuoka`, `sapporo`, `nagoya`, `hiroshima`

**FX pairs:** `USDJPY`, `EURJPY`, `GBPJPY`

**TSE tickers (examples):**

| Ticker | Company |
|---|---|
| `7203.T` | Toyota Motor |
| `9984.T` | SoftBank Group |
| `6758.T` | Sony Group |
| `6861.T` | Keyence |
| `7974.T` | Nintendo |
| `8035.T` | Tokyo Electron |

---

## Bazaar Registration

This template supports automatic discovery via `.well-known/x402.json`.

### 1. Verify your manifest

```bash
curl https://YOUR_DEPLOYED_URL/.well-known/x402.json | jq .
```

### 2. Register on x402 Bazaar

Visit [https://bazaar.x402.org](https://bazaar.x402.org) and submit your API URL. The Bazaar reads your `.well-known/x402.json` manifest to auto-populate:

- Endpoint paths and prices
- Parameter schemas
- Response schemas
- Description and metadata

### 3. Manifest structure

The manifest at `public/.well-known/x402.json` follows the x402 discovery v1 schema:

```json
{
  "$schema": "https://x402.org/schema/discovery/v1",
  "version": "1.0",
  "name": "Japan x402 APIs",
  "network": "base-sepolia",
  "facilitator": "https://x402.org/facilitator",
  "endpoints": [...]
}
```

---

## Deploy to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/japan-x402-apis)

### Manual deploy

```bash
npm install -g vercel
vercel

# Set environment variables in Vercel dashboard or via CLI:
vercel env add WALLET_ADDRESS
vercel env add FACILITATOR_URL
vercel env add CRYPTOPANIC_API_TOKEN

# Deploy to production
vercel --prod
```

After deployment, update the README with your Vercel URL and register on x402 Bazaar.

---

## Mainnet Migration

To move from Base Sepolia (testnet) to Base mainnet:

### 1. Update middleware.ts

```typescript
// Change all network values from "base-sepolia" to "base"
"/api/weather/:city*": {
  price: "$0.001",
  network: "base",  // ← change this
  ...
},
```

### 2. Update .env.local

```env
WALLET_ADDRESS=0xYourMainnetWalletAddress
FACILITATOR_URL=https://x402.org/facilitator  # supports both networks
```

### 3. Update x402.json

```json
{
  "network": "base",
  "endpoints": [
    {
      "price": { "network": "base" }
    }
  ]
}
```

### 4. Fund your wallet

- Get USDC on Base mainnet from [Coinbase](https://coinbase.com) or [Uniswap](https://uniswap.org)
- Ensure sufficient ETH for gas fees

### 5. Test before going live

```bash
x402 fetch https://your-api.vercel.app/api/weather/tokyo \
  --private-key YOUR_MAINNET_PRIVATE_KEY \
  --network base
```

---

## Using This Template for Your Japan API

This repository is designed as a template. To add your own paid API endpoint:

### 1. Add your data provider

```typescript
// lib/providers/my-data.ts
export async function fetchMyData(param: string) {
  const res = await fetch(`https://your-data-source.com/api/${param}`);
  return res.json();
}
```

### 2. Add a route handler

```typescript
// app/api/my-endpoint/[param]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchMyData } from "@/lib/providers/my-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  const { param } = await params;
  const data = await fetchMyData(param);
  return NextResponse.json(data);
}
```

### 3. Add payment gate in middleware.ts

```typescript
"/api/my-endpoint/:param*": {
  price: "$0.005",
  network: "base-sepolia",
  config: { description: "My custom Japan data" },
},
```

### 4. Add to matcher in middleware.ts

```typescript
export const config = {
  matcher: [
    ...existing routes...,
    "/api/my-endpoint/:path*",
  ],
};
```

### 5. Add to x402.json manifest

Add your endpoint schema to `public/.well-known/x402.json` following the same pattern as existing endpoints.

---

## Architecture

```
japan-x402-apis/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # API catalog UI (card grid)
│   └── api/
│       ├── weather/[city]/route.ts   # Open-Meteo
│       ├── fx/[pair]/route.ts        # ExchangeRate-API
│       ├── news/apac/route.ts        # CryptoPanic
│       └── stocks/[ticker]/route.ts  # Yahoo Finance
├── lib/
│   ├── x402.ts                 # Shared x402 config constants
│   └── providers/
│       ├── weather.ts          # Open-Meteo fetcher
│       ├── fx.ts               # ExchangeRate-API fetcher
│       ├── news.ts             # CryptoPanic fetcher + mock
│       └── stocks.ts           # Yahoo Finance fetcher + mock
├── middleware.ts               # x402 payment gates (all routes)
├── public/
│   └── .well-known/
│       └── x402.json           # Bazaar discovery manifest
└── .env.example
```

**Payment flow:**

1. Client calls `GET /api/weather/tokyo` → **402 Payment Required** + payment requirements
2. Client makes USDC micropayment on Base Sepolia
3. Client retries with `X-Payment` header → **200 OK** + weather JSON

---

## Data Sources

| API | Source | Key Required |
|---|---|---|
| Weather | [Open-Meteo](https://open-meteo.com) | No |
| FX Rates | [ExchangeRate-API](https://open.er-api.com) | No (free tier) |
| Crypto News | [CryptoPanic](https://cryptopanic.com/developers/api/) | Optional (mock fallback) |
| TSE Stocks | Yahoo Finance (unofficial) | No (mock fallback) |

---

## License

MIT
