export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    message: "OAuth callback reached",
    query: req.query
  });
}

