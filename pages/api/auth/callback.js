// pages/api/auth/callback.js

import crypto from "crypto";
import { getPool } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const { shop, code, hmac } = req.query;

    // 1. Проверки
    if (!shop || !code || !hmac) {
      return res.status(400).json({
        ok: false,
        error: "Missing required query params",
      });
    }

    if (!process.env.SHOPIFY_API_KEY || !process.env.SHOPIFY_API_SECRET) {
      return res.status(500).json({
        ok: false,
        error: "Missing Shopify env vars",
      });
    }

    // 2. Проверка HMAC
    const query = { ...req.query };
    delete query.hmac;

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
        error: "HMAC validation failed",
      });
    }

    // 3. Обмен code → access_token (fetch есть в Node 18, ничего ставить не надо)
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
    const scopes = tokenData.scope || "";

    // 4. Сохраняем в БД
    const pool = getPool();

    await pool.query(
      `
      INSERT INTO shops (shop, scopes, installed_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (shop)
      DO UPDATE SET
        scopes = EXCLUDED.scopes,
        installed_at = NOW()
      `,
      [shop, scopes]
    );

    // 5. УСПЕХ
    return res.status(200).json({
      ok: true,
      step: "oauth_complete_and_saved",
      shop,
      scopes,
      access_token_preview: accessToken.slice(0, 6) + "…",
    });
  } catch (err) {
    console.error("OAuth callback error:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}
