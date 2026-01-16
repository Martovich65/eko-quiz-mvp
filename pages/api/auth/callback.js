import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const { shop, code, hmac, ...rest } = req.query;

    // 1. Базовые проверки
    if (!shop || !code || !hmac) {
      return res.status(400).json({
        ok: false,
        error: "Missing required query parameters",
      });
    }

    // 2. Проверка HMAC
    const message = Object.keys(rest)
      .sort()
      .map((key) => `${key}=${rest[key]}`)
      .join("&");

    const generatedHmac = crypto
      .createHmac("sha256", process.env.SHOPIFY_CLIENT_SECRET)
      .update(message)
      .digest("hex");

    const hmacValid = crypto.timingSafeEqual(
      Buffer.from(generatedHmac, "utf-8"),
      Buffer.from(hmac, "utf-8")
    );

    if (!hmacValid) {
      return res.status(401).json({
        ok: false,
        error: "HMAC validation failed",
      });
    }

    // 3. Обмен code → access_token
    const tokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: process.env.SHOPIFY_CLIENT_ID,
          client_secret: process.env.SHOPIFY_CLIENT_SECRET,
          code,
        }),
      }
    );

    const contentType = tokenResponse.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await tokenResponse.text();
      return res.status(500).json({
        ok: false,
        error: "Shopify did not return JSON",
        rawResponsePreview: text.slice(0, 200),
      });
    }

    const tokenData = await tokenResponse.json();

    // ⚠️ ПОКА НЕ СОХРАНЯЕМ В БД — просто проверяем
    return res.status(200).json({
      ok: true,
      step: "2.6.3",
      shop,
      accessTokenReceived: Boolean(tokenData.access_token),
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
      details: err.message,
    });
  }
}
