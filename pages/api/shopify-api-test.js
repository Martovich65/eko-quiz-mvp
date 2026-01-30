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

    // 1. Берём токен из БД
    const { rows } = await pool.query(
      "SELECT access_token FROM shops WHERE shop = $1",
      [shop]
    );

    if (!rows.length || !rows[0].access_token) {
      return res.status(404).json({
        ok: false,
        error: "Access token not found in DB",
      });
    }

    const accessToken = rows[0].access_token;

    // 2. Запрос к Shopify API
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

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        ok: false,
        error: "Shopify API error",
        details: data,
      });
    }

    // 3. УСПЕХ 🎉
    return res.status(200).json({
      ok: true,
      step: "shopify_api_live",
      shop: data.shop.name,
      email: data.shop.email,
      plan: data.shop.plan_name,
      country: data.shop.country_name,
    });
  } catch (err) {
    console.error("Shopify API test error:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}

