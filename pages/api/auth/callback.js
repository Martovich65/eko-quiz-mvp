// pages/api/auth/callback.js

import crypto from "crypto";
import { Pool } from "pg";

export default async function handler(req, res) {
  try {
    const { shop, code } = req.query;

    // 1. Проверка обязательных параметров
    if (!shop || !code) {
      return res.status(400).json({
        ok: false,
        error: "Missing shop or code",
      });
    }

    // 2. Проверка env-переменных
    const {
      SHOPIFY_API_KEY,
      SHOPIFY_API_SECRET,
      SHOPIFY_APP_URL,
      DATABASE_URL,
    } = process.env;

    if (
      !SHOPIFY_API_KEY ||
      !SHOPIFY_API_SECRET ||
      !SHOPIFY_APP_URL ||
      !DATABASE_URL
    ) {
      return res.status(500).json({
        ok: false,
        error: "Missing required environment variables",
      });
    }

    // 3. Обмен code → access_token
    const tokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: SHOPIFY_API_KEY,
          client_secret: SHOPIFY_API_SECRET,
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

    const { access_token, scope } = tokenData;

    // 4. Подключение к Neon
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    // 5. Сохранение токена (upsert)
    await pool.query(
      `
      INSERT INTO shopify_tokens (shop, access_token, scope, installed_at)
      VALUES ($1, $2, $3, now())
      ON CONFLICT (shop)
      DO UPDATE SET
        access_token = EXCLUDED.access_token,
        scope = EXCLUDED.scope,
        installed_at = now();
      `,
      [shop, access_token, scope]
    );

    await pool.end();

    // 6. УСПЕХ
    return res.status(200).json({
      ok: true,
      step: "oauth_complete_and_saved",
      shop,
      scope,
    });
  } catch (err) {
    console.error("OAuth callback error:", err);

    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}
