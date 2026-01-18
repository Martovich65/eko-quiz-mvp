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

    // 2. Проверка переменных окружения
    const clientId = process.env.SHOPIFY_API_KEY;
    const appUrl = process.env.SHOPIFY_APP_URL;

    if (!clientId || !appUrl) {
      return res.status(500).json({
        ok: false,
        error: "Missing SHOPIFY_API_KEY or SHOPIFY_APP_URL",
      });
    }

    // 3. Генерируем state (ОБЯЗАТЕЛЬНО для OAuth)
    const state = crypto.randomBytes(16).toString("hex");

    // 4. Формируем redirect_uri
    const redirectUri = `${appUrl}/api/auth/callback`;

    // 5. Формируем OAuth URL
