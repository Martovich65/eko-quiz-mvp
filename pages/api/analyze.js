export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { image } = req.body;
    const base64Clean = image.replace(/^data:image\/\w+;base64,/, "");
    const apiKey = "68xVLzjENHNEF8ATrljwuCZ-V6T0IyKK"; 
    const apiSecret = "XcQbHyHeW7Brdvsf7XmONhccKisoVd6_";

    const formData = new URLSearchParams();
    formData.append("api_key", apiKey);
    formData.append("api_secret", apiSecret);
    formData.append("image_base64", base64Clean);
    // Добавляем дополнительные атрибуты для лучшего распознавания
    formData.append("return_attributes", "gender,age,smiling,skin,beauty");

    const faceResponse = await fetch("https://api-us.faceplusplus.com/facepp/v3/detect", {
      method: "POST",
      body: formData,
    });
    const data = await faceResponse.json();

    if (data.faces && data.faces.length > 0) {
      res.status(200).json({ passed: true, details: data.faces[0].attributes });
    } else {
      // Логируем ошибку, если лица нет
      console.log("Face++ details:", data);
      res.status(200).json({ passed: false, error: "FACE_NOT_FOUND" });
    }
  } catch (err) {
    res.status(500).json({ passed: false, error: "CONNECTION_ERROR" });
  }
}
