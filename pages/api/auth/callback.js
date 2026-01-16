import crypto from "crypto";
import { Client } from "pg";

export default async function handler(req, res) {
  try {
    const { shop, hmac, code, state } = req.query;

    if (!shop || !hmac || !code) {
      return res.status(400).json({
        ok: false,
        error: "Missing required OAuth parameters",
      });
    }

    // 1️⃣ Проверка HMAC
    const params = { ...req.query };
    delete params.hmac;
    delete params.signature;

    const message = Object.keys(params)
      .sort()
      .map((key) => `${key}=${Array.isArray(params[key]) ? params[key].join(",") : params[key]}`)
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

    // 2️⃣ Обмен code → access_token
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

    if (!tokenData.access_token) {
      return res.status(500).json({
        ok: false,
        error: "Failed to retrieve access token",
        details: tokenData,
      });
    }

    const accessToken = tokenData.access_token;

    // 3️⃣ Сохранение access_token в БД (Neon)
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS shop_tokens (
        shop TEXT PRIMARY KEY,
        access_token TEXT NOT NULL,
        installed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(
      `
      INSERT INTO shop_tokens (shop, access_token)
      VALUES ($1, $2)
      ON CONFLICT (shop)
      DO UPDATE SET access_token = EXCLUDED.access_token;
      `,
      [shop, accessToken]
    );

    await client.end();

    // 4️⃣ УСПЕХ
    return res.status(200).json({
      ok: true,
      message: "OAuth completed successfully",
      shop,
    });

  } catch (error) {
    console.error("OAuth error:", error);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}
