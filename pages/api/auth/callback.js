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

    // 1. Формируем message из query (кроме hmac)
    const message = Object.keys(rest)
      .sort()
      .map((key) => `${key}=${rest[key]}`)
      .join("&");

    // 2. Генерируем HMAC
    const generatedHmac = crypto
      .createHmac("sha256", process.env.SHOPIFY_CLIENT_SECRET)
      .update(message)
      .digest("hex");

    // 3. Безопасная проверка HMAC (БЕЗ ПАДЕНИЙ)
    let hmacValid = false;

    if (generatedHmac.length === hmac.length) {
      hmacValid = crypto.timingSafeEqual(
        Buffer.from(generatedHmac, "utf-8"),
        Buffer.from(hmac, "utf-8")
      );
    }

    // 4. Ответ (пока без access_token)
    return res.status(200).json({
      ok: true,
      step: "2.6.2.1",
      shop,
      codeExists: Boolean(code),
      hmacExists: Boolean(hmac),
      hmacValid,
    });
  } catch (error) {
    console.error("OAuth callback error:", error);

    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}
