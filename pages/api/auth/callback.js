import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const { shop, code, hmac } = req.query;

    if (!shop || !code || !hmac) {
      return res.status(400).json({
        ok: false,
        error: "Missing required OAuth parameters",
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

    // 2. Обмен code → access_token
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
        error: "Access token not received",
        tokenData,
      });
    }

    // ⚠️ ПОКА НЕ СОХРАНЯЕМ В БАЗУ — ЭТО СЛЕДУЮЩИЙ ШАГ
    const accessToken = tokenData.access_token;

    // 3. Успешная установка — редирект в админку Shopify
    return res.redirect(
      `https://${shop}/admin/apps`
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}
