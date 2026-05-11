import { useState } from "react";
import analyzeSkin from "../lib/skinAnalysis";

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [selfie, setSelfie] = useState(null);
  const [aiResults, setAiResults] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoAnalyzing, setPhotoAnalyzing] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelfie(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const startPhotoAnalysis = async () => {
    setPhotoAnalyzing(true);
    try {
      const result = await analyzeSkin(selfie);
      if (result && result.passed) {
        setAiResults(result.details);
        setStep(1);
      } else {
        alert("Помилка: ИИ не зміг розпізнати обличчя на фото. Спробуйте чіткіше знімок.");
      }
    } catch (e) {
      alert("Помилка зв'язку з сервером Face++");
    }
    setPhotoAnalyzing(false);
  };

  const buttonStyle = (variant = "primary") => ({
    width: "100%", padding: "16px", marginTop: "20px", borderRadius: "12px", border: "none",
    fontWeight: "bold", cursor: "pointer",
    backgroundColor: variant === "primary" ? "#2f855a" : "#e2e8f0",
    color: variant === "primary" ? "#fff" : "#4a5568",
  });

  if (photoAnalyzing) return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#2f855a" }}>Еко красА AI...</h2>
      <p>Аналізуємо вашу шкіру, зачекайте кілька секунд</p>
    </div>
  );

  return (
    <main style={{ maxWidth: 450, margin: "20px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#2f855a", textAlign: "center" }}>Еко красА</h1>

      {step === 0 && (
        <div style={{ textAlign: "center" }}>
          {!selfie ? (
            <div style={{ border: "2px dashed #cbd5e0", padding: "40px", borderRadius: "20px" }}>
              <p>Зробіть селфі або завантажте фото для аналізу</p>
              <input type="file" accept="image/*" capture="user" id="fileInput" style={{ display: "none" }} onChange={handleFileUpload} />
              <label htmlFor="fileInput" style={{ ...buttonStyle(), display: "block", textAlign: "center" }}>
                Обрати фото / Зробити селфі
              </label>
            </div>
          ) : (
            <div>
              <img src={selfie} style={{ width: "100%", borderRadius: "15px" }} />
              <button style={buttonStyle()} onClick={startPhotoAnalysis}>Аналізувати стан шкіри</button>
              <button style={buttonStyle("secondary")} onClick={() => setSelfie(null)}>Змінити фото</button>
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div>
          <h2>Куди надіслати результат?</h2>
          <input type="text" placeholder="Ваше ім'я" style={{ width: "100%", padding: "12px", margin: "10px 0" }} onChange={e => setName(e.target.value)} />
          <input type="email" placeholder="Email" style={{ width: "100%", padding: "12px", margin: "10px 0" }} onChange={e => setEmail(e.target.value)} />
          <button disabled={!name || !email} style={buttonStyle()} onClick={() => setStep(2)}>Отримати результати</button>
        </div>
      )}

      {step === 2 && aiResults && (
        <div style={{ background: "#f0fff4", padding: "20px", borderRadius: "15px", border: "1px solid #2f855a" }}>
          <h3>Результат для {name}:</h3>
          <p>💧 Здоров'я шкіри: {100 - Math.round(aiResults.health)}%</p>
          <p>✨ Чистота пор: {100 - Math.round(aiResults.pore)}%</p>
          <p>🌸 Відсутність акне: {100 - Math.round(aiResults.acne)}%</p>
          <p>👁️ Зона навколо очей: {100 - Math.round(aiResults.dark_circle)}%</p>
          <p>🧬 Текстура: {100 - Math.round(aiResults.texture)}%</p>
          <button style={buttonStyle()} onClick={() => window.location.href = 'https://ekokrasa.com.ua'}>Підібрати догляд</button>
        </div>
      )}
    </main>
  );
}
