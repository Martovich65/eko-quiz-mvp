import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const { shop, hmac, code, ...rest } = req.query;

    if (!shop || !hmac || !code) {
      return res.status(400).json({
        ok: false,
        error: "Missing required OAuth parameters",
      });
    }

    // 1. Проверка HMAC
    const message = Object.keys(rest)
      .sort()
      .map((key) => `${key}=${rest[key]}`)
      .join("&");

    const generatedHmac = crypto
      .createHmac("sha256", process.env.SHOPIFY_CLIENT_SECRET)
      .update(message)
      .digest("hex");

    let hmacValid = false;

    if (generatedHmac.length === hmac.length) {
      hmacValid = crypto.timingSafeEqual(
        Buffer.from(generatedHmac, "utf-8"),
        Buffer.from(hmac, "utf-8")
      );
    }

    if (!hmacValid) {
      return res.status(401).json({
        ok: false,
        error: "Invalid HMAC",
      });
    }

    // 2. Обмен code → access_token
    const tokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.SHOPIFY_CLIENT_ID,
          client_secret: process.env.SHOPIFY_CLIENT_SECRET,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    return res.status(200).json({
      ok: true,
      step: "2.6.3",
      shop,
      accessTokenReceived: Boolean(tokenData.access_token),
      scope: tokenData.scope,
      // ⛔ временно показываем token ТОЛЬКО для проверки
      accessToken: tokenData.access_token || null,
    });
  } catch (error) {
    console.error("OAuth callback error:", error);

    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}
