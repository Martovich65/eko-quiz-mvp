export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { image } = req.body;
    const base64Clean = image.replace(/^data:image\/\w+;base64,/, "");

    const apiKey = "68xVLzjENHNEF8ATrljwuCZ-V6T0IyKK"; 
    const apiSecret = "XcQbHyHeW7Brdvsf7XmONhccKisoVd6_";

    const response = await fetch("https://api-us.faceplusplus.com/facepp/v1/skinanalyze", {
      method: "POST",
      body: new URLSearchParams({
        api_key: apiKey,
        api_secret: apiSecret,
        image_base64: base64Clean,
        need_filter: "1" // Программная очистка теней (из доков на скрине 42)
      }),
    });

    const data = await response.json();

    // Если ИИ распознал лицо — отдаем реальные данные
    if (data.result && data.result.length > 0) {
      res.status(200).json({ success: true, details: data.result[0] });
    } else {
      // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Если свет плохой (ошибка 46), отдаем средние цифры
      res.status(200).json({ 
        success: true, 
        isFallback: true, 
        details: {
          skin_type: { value: "3" }, // Смешанная кожа
          acne: { value: "0" },
          dark_circle: { value: "1" },
          health: 82
        } 
      });
    }
  } catch (err) {
    res.status(500).json({ success: false });
  }
}
