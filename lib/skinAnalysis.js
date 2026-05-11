export default async function analyzeSkin(imageData) {
  // Твои ключи со скриншота №15
  const apiKey = "68xVLzjENHNEF8ATrljwuCZ-V6T0lyKK";
  const apiSecret = "XcQbHyHeW7Brdvsf7XmONhccKiscpD0s"; 

  // Очищаем base64 от технического заголовка
  const base64Image = imageData.replace(/^data:image\/(jpeg|png|jpg);base64,/, "");

  const formData = new FormData();
  formData.append("api_key", apiKey);
  formData.append("api_secret", apiSecret);
  formData.append("image_base64", base64Image);
  // Запрашиваем расширенный анализ кожи
  formData.append("return_attributes", "skinstatus");

  try {
    const response = await fetch("https://api-us.faceplusplus.com/facepp/v3/detect", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.faces && data.faces.length > 0) {
      const skin = data.faces[0].attributes.skinstatus;

      // Возвращаем МАКСИМАЛЬНЫЙ набор параметров
      return {
        passed: true,
        details: {
          health: skin.health || 0, // Общее здоровье
          stain: skin.stain || 0,   // Пигментация
          acne: skin.acne || 0,     // Акне
          dark_circle: skin.dark_circle || 0, // Темные круги
          texture: skin.texture || 0, // Гладкость
          pore: skin.pore || 0,       // Поры
          wrinkle: skin.wrinkle || 0, // Морщины
        }
      };
    } else {
      return { passed: false, error: "Обличчя не знайдено" };
    }
  } catch (error) {
    console.error("Face++ Error:", error);
    return { passed: false, error: "Помилка зв'язку з ИИ" };
  }
}
