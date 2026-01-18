// pages/api/auth.js

import crypto from "crypto";

export default function handler(req, res) {
  try {
    const { shop } = req.query;

    // 1. Проверка shop
    if (!shop) {
      return res.status(400).json({
        ok: false,
        error: "Missing shop parameter",
      });
    }

    // 2. Переменные окружения
    const clientId = process.env.SHOPIFY_API_KEY;
    const appUrl = process.env.SHOPIFY_APP_URL;

    if (!clientId || !appUrl) {
      return res.status(500).json({
        ok: false,
        error: "Missing SHOPIFY_API_KEY or SHOPIFY_APP_URL",
      });
    }

    // 3. Генерация state (обязательно для OAuth)
    const state = crypto.randomBytes(16).toString("hex");

    // 4. Redirect URI (ДОЛЖЕН совпадать с Shopify Dashboard)
    const redirectUri = `${appUrl}/api/auth/callback`;

    // 5. Scopes (должны совпадать с версией приложения)
    const scopes = [
      "read_customers",
      "write_customers",
      "read_marketing_events",
      "write_marketing_events",
    ].join(",");

    // 6. Формируем OAuth URL Shopify
    const installUrl =
      `https://${shop}/admin/oauth/authorize` +
      `?client_id=${clientId}` +
      `&scope=${encodeURIComponent(scopes)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${state}`;

    // 7. Редирект в Shopify OAuth
    return res.redirect(installUrl);
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}
