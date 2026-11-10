import { pool } from "../../../lib/db";

export default async function handler(req, res) {
  if (process.env.VERCEL_ENV !== "preview") return res.status(404).end();
  if (req.method !== "GET") return res.status(405).end();
  res.setHeader("Cache-Control", "no-store");

  const shop = "eko-krasa-test.myshopify.com";
  let accessToken;
  try {
    const { rows } = await pool.query(
      "SELECT access_token FROM shops WHERE shop = $1 LIMIT 1",
      [shop]
    );
    accessToken = rows[0]?.access_token;
  } catch {
    return res.status(503).json({ ready: false, stage: "database" });
  }

  if (!accessToken) {
    return res.status(503).json({ ready: false, stage: "shop_installation" });
  }

  try {
    const response = await fetch(`https://${shop}/admin/api/2026-07/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": accessToken },
      body: JSON.stringify({ query: "{ currentAppInstallation { accessScopes { handle } } }" }),
      signal: AbortSignal.timeout(5000),
    });
    const { data, errors } = await response.json();
    const scopes = data?.currentAppInstallation?.accessScopes;
    if (!response.ok || errors?.length || !Array.isArray(scopes)) {
      return res.status(503).json({ ready: false, stage: "shopify_authorization" });
    }

    const ready = scopes.some(({ handle }) => handle === "write_customers");
    return res.status(ready ? 200 : 503).json({ ready, stage: ready ? "complete" : "customer_write_scope" });
  } catch {
    return res.status(503).json({ ready: false, stage: "shopify_connection" });
  }
}
