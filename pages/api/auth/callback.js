// pages/api/auth/callback.js

import crypto from "crypto";
import { pool } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const { shop, code } = req.query;

    if (!shop || !code) {
      return res.status(400).json({
        ok: false,
        error: "Missing shop or code",
      });
    }

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

    const accessToken = tokenData.access_token;

    await pool.query(
      `
      INSERT INTO shops (shop, access_token, installed_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (shop)
      DO UPDATE SET
        access_token = EXCLUDED.access_token,
        installed_at = NOW()
      `,
      [shop, accessToken]
    );

    return res.redirect(
      `https://${shop}/admin/apps/api-client-3261`
    );
  } catch (error) {
    console.error("OAuth callback error:", error);

    return res.status(500).json({
      ok: false,
      error: "Internal server error",
      message: error.message,
    });
  }
}
