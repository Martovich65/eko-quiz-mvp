// pages/api/shopify-api-test.js

import { pool } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const shop = req.query.shop;

    if (!shop) {
      return res.status(400).json({
        ok: false,
        error: "Missing shop parameter",
      });
    }

    // 1️⃣ Берём access_token из БД
    const result = await pool.query(
      "SELECT access_token FROM shops WHERE shop = $1",
      [shop]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: "Shop not found in database",
      });
    }

    const accessToken = result.rows[0].access_token;

    if (!accessToken) {
      return res.status(500).json({
        ok: false,
        error: "Access token missing in database",
      });
    }

    // 2️⃣ Запрос в Shopify Admin API
    const response = await fetch(
      `https://${shop}/admin/api/2024-01/shop.json`,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    // ⛔ ВАЖНО: проверяем статус
    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({
        ok: false,
        error: "Shopify API error",
        status: response.status,
        details: text,
      });
    }

    const data = await response.json();

    // ✅ УСПЕХ
    return res.status(200).json({
      ok: true,
      shop: data.shop,
    });

  } catch (error) {
    console.error("SHOPIFY API TEST ERROR:", error);

    return res.status(500).json({
      ok: false,
      error: "Internal server error",
      message: error.message,
    });
  }
}
