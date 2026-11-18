
import express from "express";
import { facilitator } from "@payai/facilitator";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import {
  paymentMiddleware,
  x402ResourceServer
} from "@x402/express";
import { getAddress } from "viem";

const NETWORK = "eip155:8453";
const USDC_ADDRESS =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const PRICE_ATOMIC = "10000";

export function createApp(merchantAddress: string) {
  const merchant = getAddress(merchantAddress);
  const app = express();

  const resourceServer = new x402ResourceServer(
    new HTTPFacilitatorClient(facilitator)
  ).register(NETWORK, new ExactEvmScheme());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use(
    paymentMiddleware(
      {
        "GET /premium": {
          accepts: {
            scheme: "exact",
            network: NETWORK,
            payTo: merchant,
            price: {
              amount: PRICE_ATOMIC,
              asset: USDC_ADDRESS,
              extra: {
                name: "USD Coin",
                version: "2"
              }
            },
            maxTimeoutSeconds: 60
          },
          description: "Premium Base Mainnet content",
          mimeType: "application/json"
        }
      },
      resourceServer
    )
  );

  app.get("/premium", (_req, res) => {
    res.json({ content: "premium content" });
  });

  return app;
}
