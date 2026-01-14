import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const { shop, hmac, code, ...rest } = req.query;

    // 1. Проверка обязательных параметров
    if (!shop || !hmac || !code) {
      return res.status(400).json({
        ok: false,
        error: "Missing required query parameters",
        received: req.query,
      });
    }

    // 2. Формируем message из query (без hmac)
    const message = Object.keys(rest)
      .sort()
      .map((key) => `${key}=${rest[key]}`)
      .join("&");

    // 3. Генерируем HMAC
    const generatedHmac = crypto
      .createHmac("sha256", process.env.SHOPIFY_CLIENT_SECRET)
      .update(message)
      .digest("hex");

    // 4. Сравниваем HMAC
    const isValid = generatedHmac === hmac;

    // 5. Возвращаем РЕЗУЛЬТАТ (никаких 500)
    return res.status(200).json({
      ok: true,
      shop,
      code,
      hmacValid: isValid,
      generatedHmac,
      receivedHmac: hmac,
    });
  } catch (error) {
    // 🔥 ЛЮБАЯ ошибка теперь не валит сервер
    return res.status(500).json({
      ok: false,
      error: "Callback crashed",
      message: error.message,
    });
  }
}



