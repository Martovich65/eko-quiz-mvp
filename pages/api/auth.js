export default async function handler(req, res) {
  const shop = req.query.shop;

  if (!shop) {
    return res.status(400).send("Missing ?shop parameter");
  }

  const redirectUri = `https://${req.headers.host}/api/auth/callback`;

  const installUrl =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${process.env.SHOPIFY_CLIENT_ID}` +
    `&scope=read_customers,write_customers,read_marketing_events,write_marketing_events` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  res.redirect(installUrl);
}

