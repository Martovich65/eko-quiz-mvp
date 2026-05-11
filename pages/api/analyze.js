export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { image } = req.body;
    // Очистка изображения от префикса браузера
    const base64Clean = image.replace(/^data:image\/\w+;base64,/, "");

    // ТВОИ КЛЮЧИ (уже вставлены)
    const apiKey = "68xVLzjENHNEF8ATrljwuCZ-V6T0IyKK"; 
    const apiSecret = "XcQbHyHeW7Brdvsf7XmONhccKisoVd6_";

    const formData = new URLSearchParams();
    formData.append("api_key", apiKey);
    formData.append("api_secret", apiSecret);
    formData.append("image_base64", base64Clean);
    formData.append("return_attributes", "skin,age,beauty");

    const faceResponse = await fetch("https://api-us.faceplusplus.com/facepp/v3/detect", {
      method: "POST",
      body: formData,
    });

    const data = await faceResponse.json();

    if (data.faces && data.faces.length > 0) {
      // Возвращаем данные о коже обратно в квиз
      res.status(200).json({ passed: true, details: data.faces[0].attributes });
    } else {
      res.status(200).json({ passed: false, error: "FACE_NOT_FOUND" });
    }
  } catch (err) {
    res.status(500).json({ passed: false, error: "CONNECTION_ERROR" });
  }
}
