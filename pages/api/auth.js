// pages/api/auth.js

export default function handler(req, res) {
  const { shop } = req.query;

  if (!shop) {
    return res.status(400).json({
      ok: false,
      error: "Missing shop parameter",
    });
  }

  const apiKey = process.env.SHOPIFY_API_KEY;
  const appUrl = process.env.SHOPIFY_APP_URL;
  const scopes = process.env.SHOPIFY_SCOPES;

  if (!apiKey || !appUrl || !scopes) {
    return res.status(500).json({
      ok: false,
      error: "Missing SHOPIFY_API_KEY, SHOPIFY_APP_URL or SHOPIFY_SCOPES",
    });
  }

  const redirectUri = `${appUrl}/api/auth/callback`;

  const installUrl =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${apiKey}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return res.redirect(installUrl);
}
