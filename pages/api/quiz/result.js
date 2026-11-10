import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const landing = "https://7h3pfvjpw2lza726-98542027044.shopifypreview.com";
const labels = {
  nasolabial_fold: "Носогубні складки",
  pores_forehead: "Помітні пори на лобі",
  pores_left_cheek: "Помітні пори на лівій щоці",
  pores_right_cheek: "Помітні пори на правій щоці",
  pores_jaw: "Помітні пори в зоні підборіддя",
  forehead_wrinkle: "Лінії на лобі",
  eye_finelines: "Тонкі лінії навколо очей",
  crows_feet: "Лінії біля зовнішніх кутиків очей",
  eye_pouch: "Припухлість під очима",
  dark_circle: "Темні кола під очима",
  skin_spot: "Плями на шкірі",
  blackhead: "Чорні цятки",
  acne: "Видимі висипання",
};

function key() {
  return createHash("sha256").update("eko-quiz-preview-result-v1:").update(process.env.FACEPP_API_SECRET).digest();
}

function seal(kind, data, minutes) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify({ kind, data, expires: Date.now() + minutes * 60000 })), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

function open(token, kind) {
  if (typeof token !== "string" || !/^[a-zA-Z0-9_-]{38,4000}$/.test(token)) return null;
  try {
    const bytes = Buffer.from(token, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", key(), bytes.subarray(0, 12));
    decipher.setAuthTag(bytes.subarray(12, 28));
    const payload = JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString());
    return payload.kind === kind && payload.expires > Date.now() ? payload.data : null;
  } catch {
    return null;
  }
}

export function sealAnalysis(result) {
  const observations = Object.entries(labels).filter(([name]) => result[name]?.value === 1).map(([, label]) => label);
  return seal("analysis", observations, 30);
}

export default function handler(req, res) {
  if (process.env.VERCEL_ENV !== "preview" || !process.env.FACEPP_API_SECRET) return res.status(404).end();
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    if (req.headers.origin !== landing) return res.status(403).end();
    res.setHeader("Access-Control-Allow-Origin", landing);
    res.setHeader("Vary", "Origin");
    const data = open(req.query.token, "result");
    return data ? res.status(200).json(data) : res.status(404).json({ error: "Result expired or unavailable" });
  }

  if (req.method !== "POST") return res.status(405).end();
  const { analysisToken, skinType, mainProblem, desiredResult } = req.body ?? {};
  const answers = { skinType, mainProblem, desiredResult };
  if (Object.values(answers).some((value) => typeof value !== "string" || !value.trim() || value.length > 100)) {
    return res.status(400).json({ error: "Invalid answers" });
  }
  const observations = open(analysisToken, "analysis");
  const token = seal("result", { observations, answers }, 15);
  return res.status(200).json({ url: landing + "/#eko-quiz-result=" + token });
}
