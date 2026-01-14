import crypto from "crypto";

export default async function handler(req, res) {
  const { shop, hmac, code, ...rest } = req.query;

  if (!shop || !hmac || !code) {
    return res.status(400).json({
      ok: false,
      error: "Missing required Shopify OAuth parameters",
      received: req.query,
    });
  }

  // Собираем строку параметров (без hmac)
  const message = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join("&");

  const generatedHmac = crypto
    .createHmac("sha256", process.env.SHOPIFY_CLIENT_SECRET)
    .update(message)
    .digest("hex");

  const isValid = crypto.timingSafeEqual(
    Buffer.from(generatedHmac),
    Buffer.from(hmac)
  );

  return res.status(200).json({
    ok: true,
    step: "HMAC check ready",
    isValid,
    shop,
    code,
  });
}


