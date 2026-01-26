import { Pool } from "pg";

export default async function handler(req, res) {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        ok: false,
        error: "DATABASE_URL is missing in env",
      });
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    const result = await pool.query("SELECT NOW()");

    await pool.end();

    return res.status(200).json({
      ok: true,
      db: "connected",
      now: result.rows[0].now,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}
