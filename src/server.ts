
import { createApp } from "./app.js";

const port = Number(process.env.PORT || 3000);
const host = "0.0.0.0";

const merchantAddress = process.env.MERCHANT_ADDRESS;

if (!merchantAddress) {
  throw new Error("MERCHANT_ADDRESS is missing");
}

const app = createApp(merchantAddress);

app.listen(port, host, () => {
  console.log(`x402 API listening on port ${port}`);
});
