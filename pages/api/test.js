export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    shopifyClientIdExists: Boolean(process.env.SHOPIFY_CLIENT_ID),
    shopifyClientSecretExists: Boolean(process.env.SHOPIFY_CLIENT_SECRET),
  });
}

