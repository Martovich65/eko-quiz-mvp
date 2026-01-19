// pages/api/auth/callback.js

export default async function handler(req, res) {
  try {
    const { shop, code } = req.query;

    if (!shop || !code) {
      return res.status(400).json({
        ok: false,
        error: "Missing shop or code",
      });
    }

    const clientId = process.env.SHOPIFY_API_KEY;
    const clientSecret = process.env.SHOPIFY_API_SECRET;
    const appUrl = process.env.SHOPIFY_APP_URL;

    if (!clientId || !clientSecret || !appUrl) {
      return res.status(500).json({
        ok: false,
        error: "Missing Shopify environment variables",
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
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(400).json({
        ok: false,
        error: "Failed to get access token",
        details: tokenData,
      });
    }

    // ✅ УСПЕХ (пока без БД)
    return res.status(200).json({
      ok: true,
      step: "oauth_complete_no_db",
      shop,
      scopes: tokenData.scope,
    });
  } catch (err) {
    console.error("OAuth callback error:", err);

    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
}
