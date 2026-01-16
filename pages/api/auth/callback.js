import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const { shop, code, hmac } = req.query;

    // 1️⃣ Проверка обязательных параметров
    if (!shop || !code || !hmac) {
      return res.status(400).json({
        ok: false,
        error: "Missing required query parameters",
      });
    }

    // 2️⃣ Проверка HMAC (пока диагностическая)
    const { hmac: _hmac, ...rest } = req.query;
    const message = new URLSearchParams(rest).toString();

    const generatedHmac = crypto
      .createHmac("sha256", process.env.SHOPIFY_CLIENT_SECRET)
      .update(message)
      .digest("hex");

    const hmacValid =
      generatedHmac.length === hmac.length &&
      crypto.timingSafeEqual(
        Buffer.from(generatedHmac),
        Buffer.from(hmac)
      );

    // 3️⃣ 🔥 ПРАВИЛЬНЫЙ ОБМЕН code → access_token (FORM ENCODED)
    const tokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
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
        tokenData,
      });
    }

    // 4️⃣ УСПЕШНЫЙ РЕЗУЛЬТАТ
    return res.status(200).json({
      ok: true,
      step: "2.6.3",
      message: "Access token successfully received",
      shop,
      hmacValid,
      accessTokenReceived: true,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}
