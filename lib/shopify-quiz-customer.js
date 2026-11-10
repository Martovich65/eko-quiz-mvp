import { pool } from "./db";

const shop = "eko-krasa-test.myshopify.com";

const upsertCustomer = `
  mutation SaveQuizCustomer($identifier: CustomerSetIdentifiers!, $input: CustomerSetInput!) {
    customerSet(identifier: $identifier, input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`;

const saveMetafield = `
  mutation SaveQuizResult($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { id }
      userErrors { field message }
    }
  }
`;

async function shopifyMutation(query, variables, operation, token) {
  const response = await fetch(`https://${shop}/admin/api/2026-07/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) throw new Error(`Shopify request failed (${response.status})`);

  const { data, errors } = await response.json();
  const result = data?.[operation];
  if (errors?.length || !result || result.userErrors?.length) {
    throw new Error(`Shopify rejected ${operation}`);
  }
  return result;
}

// Server only. Call after verifying ownership of the email and validating the
// submission. analysisSummary must come from the server-side Face++ response.
export async function saveQuizCustomer({ verifiedEmail, name, phone, answers, analysisSummary, completedAt }) {
  const email = verifiedEmail.trim().toLowerCase();
  const { rows } = await pool.query(
    "SELECT access_token FROM shops WHERE shop = $1 LIMIT 1",
    [shop]
  );
  const token = rows[0]?.access_token;
  if (!token) throw new Error("Shopify app is not installed for the quiz store");

  const { customer } = await shopifyMutation(upsertCustomer, {
    identifier: { email },
    input: { email, firstName: name, phone },
  }, "customerSet", token);

  if (!customer?.id) throw new Error("Shopify did not return a customer ID");

  await shopifyMutation(saveMetafield, {
    metafields: [{
      ownerId: customer.id,
      namespace: "eko_quiz",
      key: "latest_result",
      type: "json",
      value: JSON.stringify({ completedAt, answers, analysisSummary }),
    }],
  }, "metafieldsSet", token);

  return customer.id;
}
