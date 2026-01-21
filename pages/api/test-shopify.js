// pages/api/test-shopify.js

export default async function handler(req, res) {
  try {
    const shop = req.query.shop;

    if (!shop) {
      return res.status(400).json({
        ok: false,
        error: "Missing shop parameter",
      });
    }

    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({
        ok: false,
        error: "Missing SHOPIFY_ACCESS_TOKEN in env",
      });
    }

    const response = await fetch(
      `https://${shop}/admin/api/2026-01/shop.json`,
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

    return res.status(200).json({
      ok: true,
      shop: data.shop.myshopify_domain,
      shop_name: data.shop.name,
      email: data.shop.email,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Unexpected server error",
      message: err.message,
    });
  }
}

