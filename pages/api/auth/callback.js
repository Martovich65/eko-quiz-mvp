// pages/api/auth/callback.js

import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const { shop, code, hmac, state } = req.query;

    // 1. Базовая проверка параметров
    if (!shop || !code || !hmac) {
      return res.status(400).json({
        ok: false,
        error: "Missing shop or code",
      });
    }

    // 2. Проверка env
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiSecret = process.env.SHOPIFY_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({
        ok: false,
        error: "Missing SHOPIFY_API_KEY or SHOPIFY_API_SECRET",
      });
    }

    // 3. Проверка HMAC (обязательно)
    const query = { ...req.query };
    delete query.hmac;

    const message = Object.keys(query)
      .sort()
      .map((key) => `${key}=${Array.isArray(query[key]) ? query[key].join(",") : query[key]}`)
      .join("&");

    const generatedHmac = crypto
      .createHmac("sha256", apiSecret)
      .update(message)
      .digest("hex");

    if (generatedHmac !== hmac) {
      return res.status(401).json({
        ok: false,
        error: "HMAC validation failed",
      });
    }

    // 4. Обмен code → access_token (fetch встроен в Node 18 / Vercel)
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: apiKey,
        client_secret: apiSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(500).json({
        ok: false,
        error: "Failed to get access token",
        details: tokenData,
      });
    }

    // 5. УСПЕХ — токен получен и проверен
    return res.status(200).json({
      ok: true,
      step: "oauth_complete_verified",
      shop,
      scopes: tokenData.scope,
      access_token_preview: tokenData.access_token.slice(0, 6) + "…",
    });
  } catch (err) {
    console.error("OAuth callback error:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}
