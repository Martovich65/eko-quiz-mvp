import crypto from "crypto";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  try {
    const { shop, code, hmac } = req.query;

    if (!shop || !code || !hmac) {
      return res.status(400).json({ ok: false, error: "Missing params" });
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

    if (
      !crypto.timingSafeEqual(
        Buffer.from(generatedHmac),
        Buffer.from(hmac)
      )
    ) {
      return res.status(401).json({ ok: false, error: "Invalid HMAC" });
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
      return res
        .status(500)
        .json({ ok: false, error: "No access token", tokenData });
    }

    const { access_token, scope } = tokenData;

    // 3. Сохранение в Neon
    await pool.query(
      `
      INSERT INTO shopify_tokens (shop, access_token, scope)
      VALUES ($1, $2, $3)
      ON CONFLICT (shop)
      DO UPDATE SET
        access_token = EXCLUDED.access_token,
        scope = EXCLUDED.scope,
        installed_at = now()
      `,
      [shop, access_token, scope]
    );

    // 4. Финальный редирект (пока простой)
    return res.redirect(
      `https://${shop}/admin/apps`
    );
  } catch (err) {
    console.error("OAuth callback error:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
      details: err.message,
    });
  }
}
