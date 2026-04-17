import { x402ResourceServer } from "@x402/next";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";

const FACILITATOR_URL =
  process.env.FACILITATOR_URL ?? "https://facilitator.x402.org";

export const NETWORK = "eip155:84532"; // Base Sepolia

export const WALLET_ADDRESS = (
  process.env.WALLET_ADDRESS ?? "0x0000000000000000000000000000000000000000"
) as `0x${string}`;

export const resourceServer = new x402ResourceServer(
  new HTTPFacilitatorClient({ url: FACILITATOR_URL })
).register(NETWORK, new ExactEvmScheme());
