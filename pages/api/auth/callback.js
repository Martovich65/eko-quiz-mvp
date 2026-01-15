import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const query = { ...req.query };
    const { hmac, shop, code } = query;

    if (!shop || !code || !hmac) {
      return res.status(400).json({
        ok: false,
        error: "Missing required query parameters",
        query,
      });
    }

    // 1️⃣ Убираем hmac из параметров
    delete query.hmac;

    // 2️⃣ Строим строку запроса
    const message = Object.keys(query)
      .sort()
      .map((key) => `${key}=${query[key]}`)
      .join("&");

    // 3️⃣ Генерируем свой hmac
    const generatedHmac = crypto
      .createHmac("sha256", process.env.SHOPIFY_CLIENT_SECRET)
      .update(message)
      .digest("hex");

    // 4️⃣ Сравниваем
    const hmacValid = crypto.timingSafeEqual(
      Buffer.from(generatedHmac, "utf-8"),
      Buffer.from(hmac, "utf-8")
    );

    return res.status(200).json({
      ok: true,
      step: "2.6.2",
      shop,
      hmacValid,
      generatedHmac,
      receivedHmac: hmac,
    });

  } catch (error) {
    console.error("OAuth HMAC verification error:", error);

    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}




