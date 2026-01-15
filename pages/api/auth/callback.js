export default async function handler(req, res) {
  try {
    const { shop, code, hmac } = req.query;

    if (!shop || !code || !hmac) {
      return res.status(400).json({
        ok: false,
        error: "Missing required query parameters",
        query: req.query,
      });
    }

    // ВАЖНО: здесь пока НЕТ реальной проверки HMAC
    // Это только безопасная точка входа

    return res.status(200).json({
      ok: true,
      step: "2.6.1",
      message: "OAuth callback reached safely",
      shop,
      codeExists: Boolean(code),
      hmacExists: Boolean(hmac),
    });

  } catch (error) {
    console.error("OAuth callback error:", error);

    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}




