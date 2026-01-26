import crypto from "crypto";
import { Pool } from "pg";

export default async function handler(req, res) {
  try {
    const { shop, code, hmac } = req.query;

    if (!shop || !code || !hmac) {
      return res.status(400).json({
        ok: false,
        error: "Missing shop or code",
      });
    }

    // 1. Проверка HMAC
    const query = { ...req.query };
    delete query.hmac;
    delete query.signature;

    const message = Object.keys(query)
      .sort()
      .map((key) => `${key}=${Array.isArray(query[key]) ? query[key].join(",") : query[key]}`)
      .join("&");

    const generatedHmac = crypto
      .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
      .update(message)
      .digest("hex");

    if (generatedHmac !== hmac) {
      return res.status(401).json({
        ok: false,
        error: "HMAC verification failed",
      });
    }

    // 2. Запрос access_token у Shopify
    const tokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.SHOPIFY_API_KEY,
          client_secret: process.env.SHOPIFY_API_SECRET,
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

    // 3. Сохраняем в БД
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await pool.query(
      `
      INSERT INTO shops (shop, access_token, scopes)
      VALUES ($1, $2, $3)
      ON CONFLICT (shop)
      DO UPDATE SET
        access_token = EXCLUDED.access_token,
        scopes = EXCLUDED.scopes,
        installed_at = NOW()
      `,
      [shop, tokenData.access_token, tokenData.scope]
    );

    await pool.end();

    // 4. УСПЕХ
    return res.status(200).json({
      ok: true,
      step: "oauth_complete_and_saved",
      shop,
    });
  } catch (err) {
    console.error("OAuth callback error:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}
