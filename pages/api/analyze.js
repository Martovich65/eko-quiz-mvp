export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { image } = req.body ?? {};
  if (typeof image !== "string" || !image.trim()) {
    return res.status(400).json({ success: false, error: "Image required" });
  }

  const apiKey = process.env.FACEPP_API_KEY;
  const apiSecret = process.env.FACEPP_API_SECRET;
  if (!apiKey || !apiSecret) {
    return res.status(503).json({ success: false, error: "Face++ is not configured" });
  }

  try {
    const response = await fetch("https://api-us.faceplusplus.com/facepp/v1/skinanalyze", {
      method: "POST",
      body: new URLSearchParams({
        api_key: apiKey,
        api_secret: apiSecret,
        image_base64: image.replace(/^data:image\/\w+;base64,/, ""),
        need_filter: "1",
      }),
    });
    const data = await response.json().catch(() => null);
    const result = Array.isArray(data?.result) ? data.result[0] : data?.result;
    const fields = (value) => value && typeof value === "object" && !Array.isArray(value) ? Object.keys(value) : [];
    const diagnostics = {
      faceppStatus: response.status,
      responseFields: fields(data),
      resultFields: fields(result),
    };

    if (!response.ok || !data || data.error_message) {
      return res.status(502).json({ success: false, error: "Face++ request failed", diagnostics });
    }
    if (!diagnostics.resultFields.length) {
      return res.status(422).json({ success: false, error: "Face++ returned no recognized skin result", diagnostics });
    }

    return res.status(200).json({ success: true, details: result, diagnostics });
  } catch {
    return res.status(502).json({ success: false, error: "Face++ response unavailable" });
  }
}
