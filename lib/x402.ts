export const X402_CONFIG = {
  network: "base-sepolia" as const,
  facilitatorUrl:
    process.env.FACILITATOR_URL ?? "https://x402.org/facilitator",
  walletAddress: (process.env.WALLET_ADDRESS ??
    "0x0000000000000000000000000000000000000000") as `0x${string}`,
  prices: {
    weather: "$0.001",
    fx: "$0.001",
    news: "$0.005",
    stocks: "$0.01",
  },
} as const;
