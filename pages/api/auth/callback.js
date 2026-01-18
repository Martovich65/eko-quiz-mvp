import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const { shop, code, hmac } = req.query;

    if (!shop || !code || !hmac) {
      return res.status(400).json({
        ok: false,
        error: "Missing required query parameters",
      });
    }

    // 1. Проверка HMAC
    const params = { ...req.query };
    delete params.hmac;
    delete params.signature;

    const message = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    const generatedHmac = crypto
      .createHmac("sha256", process.env.SHOPIFY_CLIENT_SECRET)
      .update(message)
      .digest("hex");

    if (generatedHmac !== hmac) {
      return res.status(401).json({
        ok: false,
        error: "HMAC validation failed",
      });
    }

    // 2. Обмен code → access_token (БЕЗ БД)
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

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(500).json({
        ok: false,
        error: "Failed to get access token",
        details: tokenData,
      });
    }

    // 3. ВРЕМЕННО просто подтверждаем успех
    return res.status(200).json({
      ok: true,
      step: "oauth_complete_no_db",
      shop,
      scopes: tokenData.scope,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Unexpected server error",
      message: err.message,
    });
  }
}
