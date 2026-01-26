import { Pool } from "pg";

export default async function handler(req, res) {
  try {
    // 1. Проверяем, есть ли DATABASE_URL
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        ok: false,
        error: "DATABASE_URL is missing in env",
      });
    }

    // 2. Создаём подключение
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    // 3. Простой тестовый запрос
    const result = await pool.query("SELECT 1 AS test");

    // 4. Закрываем соединение
    await pool.end();

    // 5. Успех
    return res.status(200).json({
      ok: true,
      db: "connected",
      test: result.rows[0],
    });
  } catch (err) {
    console.error("DB TEST ERROR:", err);

    return res.status(500).json({
      ok: false,
      error: "DB connection failed",
      message: err.message,
    });
  }
}

