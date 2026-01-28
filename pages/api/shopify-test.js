// pages/api/shopify-test.js

import { Pool } from "pg";

export default async function handler(req, res) {
  try {
    const shop = req.query.shop;

    if (!shop) {
      return res.status(400).json({
        ok: false,
        error: "Missing shop parameter",
      });
    }

    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        ok: false,
        error: "DATABASE_URL is missing",
      });
    }

    // 1. Подключаемся к БД
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    // 2. Берём токен для этого магазина
    const { rows } = await pool.query(
      "SELECT access_token FROM shops WHERE shop = $1 LIMIT 1",
      [shop]
    );

    await pool.end();

    if (!rows.length) {
      return res.status(404).json({
        ok: false,
        error: "Shop not found in database",
      });
    }

    const accessToken = rows[0].access_token;

    // 3. Делаем запрос в Shopify API
    const response = await fetch(
      `https://${shop}/admin/api/2024-01/shop.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        ok: false,
        error: "Shopify API error",
        details: data,
      });
    }

    // 4. УСПЕХ
    return res.status(200).json({
      ok: true,
      step: "shopify_api_verified",
      shop: data.shop.myshopify_domain,
      name: data.shop.name,
      email: data.shop.email,
      plan: data.shop.plan_name,
    });
  } catch (err) {
    console.error("Shopify test error:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
      message: err.message,
    });
  }
}

