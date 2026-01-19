// pages/api/auth/callback.js

import crypto from "crypto";
import { Pool } from "pg";

export default async function handler(req, res) {
  try {
    const { shop, code, hmac } = req.query;

    if (!shop || !code || !hmac) {
      return res.status(400).json({
        ok: false,
        error: "Missing OAuth parameters",
      });
    }

    const {
      SHOPIFY_API_KEY,
      SHOPIFY_API_SECRET,
      DATABASE_URL,
    } = process.env;

    if (!SHOPIFY_API_KEY || !SHOPIFY_API_SECRET || !DATABASE_URL) {
      return res.status(500).json({
        ok: false,
        error: "Missing environment variables",
      });
    }

    // 1. HMAC check
    const query = { ...req.query };
    delete query.hmac;
    delete query.signature;

    const message = Object.keys(query)
      .sort()
      .map((key) => `${key}=${Array.isArray(query[key]) ? query[key].join(",") : query[key]}`)
      .join("&");

    const generatedHmac = crypto
      .createHmac("sha256", SHOPIFY_API_SECRET)
      .update(message)
      .digest("hex");

    if (generatedHmac !== hmac) {
      return res.status(401).json({
        ok: false,
        error: "Invalid HMAC",
      });
    }

    // 2. code → access_token
    const tokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        error: "Failed to get access token",
        details: tokenData,
      });
    }

    const { access_token, scope } = tokenData;

    // 3. Save to DB
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

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

    await pool.end();

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
