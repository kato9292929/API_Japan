import { paymentProxy, x402ResourceServer } from "@x402/next";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";

const FACILITATOR_URL =
  process.env.FACILITATOR_URL ?? "https://facilitator.x402.org";

const WALLET_ADDRESS = (process.env.WALLET_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

// eip155:84532 = Base Sepolia, eip155:8453 = Base Mainnet
const NETWORK = "eip155:84532";

const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
const resourceServer = new x402ResourceServer(facilitatorClient).register(
  NETWORK,
  new ExactEvmScheme()
);

export const middleware = paymentProxy(
  {
    "/api/weather/:city*": {
      accepts: {
        scheme: "exact",
        price: "$0.001",
        network: NETWORK,
        payTo: WALLET_ADDRESS,
      },
      description: "Japan Weather Data - temperature, humidity, wind speed",
    },
    "/api/fx/:pair*": {
      accepts: {
        scheme: "exact",
        price: "$0.001",
        network: NETWORK,
        payTo: WALLET_ADDRESS,
      },
      description: "JPY Exchange Rates - USDJPY, EURJPY, GBPJPY",
    },
    "/api/news/apac": {
      accepts: {
        scheme: "exact",
        price: "$0.005",
        network: NETWORK,
        payTo: WALLET_ADDRESS,
      },
      description: "APAC Crypto News - latest 10 headlines with sentiment",
    },
    "/api/stocks/:ticker*": {
      accepts: {
        scheme: "exact",
        price: "$0.01",
        network: NETWORK,
        payTo: WALLET_ADDRESS,
      },
      description: "TSE Stock Data - price, volume, PER",
    },
  },
  resourceServer
);

export const config = {
  matcher: [
    "/api/weather/:path*",
    "/api/fx/:path*",
    "/api/news/apac",
    "/api/stocks/:path*",
  ],
};
