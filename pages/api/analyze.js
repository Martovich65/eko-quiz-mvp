export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  try {
    const { image } = req.body;
    const base64Clean = image.replace(/^data:image\/\w+;base64,/, "");

    const apiKey = "68xVLzjENHNEF8ATrljwuCZ-V6T0IyKK"; 
    const apiSecret = "XcQbHyHeW7Brdvsf7XmONhccKisoVd6_";

    // ПРАВИЛЬНЫЙ URL ИЗ ТВОЕЙ ДОКУМЕНТАЦИИ
    const apiUrl = "https://api-us.faceplusplus.com/facepp/v1/skinanalyze";

    const formData = new URLSearchParams();
    formData.append("api_key", apiKey);
    formData.append("api_secret", apiSecret);
    formData.append("image_base64", base64Clean);

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    // Согласно документации, ищем массив "result"
    if (data.result && data.result.length > 0) {
      res.status(200).json({ passed: true, details: data.result[0] });
    } else {
      // Если лицо не найдено или ошибка (как на скрине 39)
      res.status(200).json({ 
        passed: false, 
        error: data.error_message || "FACE_NOT_FOUND" 
      });
    }
  } catch (err) {
    res.status(500).json({ passed: false, error: "SERVER_ERROR" });
  }
}
