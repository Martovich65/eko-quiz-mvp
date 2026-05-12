export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { image } = req.body;
    const base64Clean = image.replace(/^data:image\/\w+;base64,/, "");

    const apiKey = "68xVLzjENHNEF8ATrljwuCZ-V6T0IyKK"; 
    const apiSecret = "XcQbHyHeW7Brdvsf7XmONhccKisoVd6_";

    // Используем URL профессионального Skinanalyze из документации
    const apiUrl = "https://api-us.faceplusplus.com/facepp/v1/skinanalyze";

    const formData = new URLSearchParams();
    formData.append("api_key", apiKey);
    formData.append("api_secret", apiSecret);
    formData.append("image_base64", base64Clean);
    // Включаем фильтрацию для плохих условий освещения (согласно докам)
    formData.append("need_filter", "1"); 

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    // Если Face++ вернул результат, отправляем его на фронтенд
    if (data.result && data.result.length > 0) {
      res.status(200).json({ passed: true, details: data.result[0] });
    } else {
      // Если лицо не распознано из-за света, возвращаем ошибку для активации fallback
      res.status(200).json({ passed: false, error: data.error_message || "FACE_NOT_FOUND" });
    }
  } catch (err) {
    res.status(500).json({ passed: false, error: "SERVER_ERROR" });
  }
}
