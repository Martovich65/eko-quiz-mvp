import crypto from "crypto";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  try {
    const { shop, hmac, code } = req.query;

    if (!shop || !hmac || !code) {
      return res.status(400).json({
        ok: false,
        error: "Missing shop, hmac or code",
      });
    }

    // 1️⃣ Проверка HMAC
    const query = { ...req.query };
    delete query.hmac;
    delete query.signature;

    const message = Object.keys(query)
      .sort()
      .map((key) => `${key}=${query[key]}`)
      .join("&");

    const generatedHmac = crypto
      .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
      .update(message)
      .digest("hex");

    if (generatedHmac !== hmac) {
      return res.status(401).json({
        ok: false,
        error: "HMAC validation failed",
      });
    }

    // 2️⃣ Обмен code → access_token (fetch встроен в Next.js!)
    const tokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    const accessToken = tokenData.access_token;
    const scopes = tokenData.scope;

    // 3️⃣ Сохраняем в Neon (Postgres)
    const client = await pool.connect();

    await client.query(
      `
      INSERT INTO shops (shop, access_token, scopes, installed_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (shop)
      DO UPDATE SET
        access_token = EXCLUDED.access_token,
        scopes = EXCLUDED.scopes,
        installed_at = NOW();
      `,
      [shop, accessToken, scopes]
    );

    client.release();

    // 4️⃣ Успех
    return res.status(200).json({
      ok: true,
      step: "oauth_complete_saved",
      shop,
      scopes,
      access_token_preview: accessToken.slice(0, 6) + "…",
    });
  } catch (err) {
    console.error("CALLBACK ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}
