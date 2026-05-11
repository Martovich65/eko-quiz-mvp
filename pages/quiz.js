import { useEffect, useRef, useState } from "react";
import analyzeSkin from "../lib/skinAnalysis";

export default function Quiz() {
  const [step, setStep] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [selfie, setSelfie] = useState(null);
  const [aiResults, setAiResults] = useState(null); // Сюда сохраним данные ИИ

  const [skinType, setSkinType] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [photoAnalyzing, setPhotoAnalyzing] = useState(false);
  const [photoRejected, setPhotoRejected] = useState(false);

  const primaryButtonStyle = (disabled = false) => ({
    marginTop: 24, width: "100%", padding: "16px",
    backgroundColor: disabled ? "#a0aec0" : "#2f855a",
    color: "#ffffff", border: "none", borderRadius: "12px",
    cursor: disabled ? "not-allowed" : "pointer", fontWeight: "bold",
  });

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setStream(mediaStream);
      setCameraOn(true);
    } catch (e) { alert("Дозвольте доступ до камери."); }
  };

  const captureSelfie = () => {
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    setSelfie(canvas.toDataURL("image/jpeg", 0.9));
    if (stream) stream.getTracks().forEach(t => t.stop());
    setCameraOn(false);
  };

  const startPhotoAnalysis = async () => {
    setPhotoAnalyzing(true);
    try {
      const result = await analyzeSkin(selfie);
      if (result && result.passed) {
        setAiResults(result.details); // Сохраняем все параметры (поры, морщины и т.д.)
        setStep(1);
      } else { setPhotoRejected(true); }
    } catch (e) { setPhotoRejected(true); }
    setPhotoAnalyzing(false);
  };

  if (photoAnalyzing) return (
    <main style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <h2 style={{ color: "#2f855a" }}>Еко красА AI аналізує шкіру...</h2>
      <div className="loader">Зачекайте декілька секунд</div>
    </main>
  );

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#2f855a", textAlign: "center" }}>Еко красА</h1>

      {step === 0 && (
        <>
          {!selfie && !cameraOn && <button style={primaryButtonStyle()} onClick={startCamera}>Почати AI-сканування</button>}
          {cameraOn && (
            <>
              <video ref={videoRef} autoPlay playsInline style={{ width: "100%", borderRadius: 12 }} />
              <button style={primaryButtonStyle()} onClick={captureSelfie}>Зробити фото</button>
            </>
          )}
          {selfie && !photoRejected && (
            <>
              <img src={selfie} style={{ width: "100%", borderRadius: 12 }} />
              <button style={primaryButtonStyle()} onClick={startPhotoAnalysis}>Аналізувати стан шкіри</button>
            </>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </>
      )}

      {step === 1 && (
        <>
          <h2>Дякуємо! Крок 2: Ваші контакти</h2>
          <input type="text" placeholder="Ваше ім'я" style={{ width: "100%", padding: 12, marginBottom: 10 }} onChange={e => setName(e.target.value)} />
          <input type="email" placeholder="Email для результатів" style={{ width: "100%", padding: 12, marginBottom: 10 }} onChange={e => setEmail(e.target.value)} />
          <button disabled={!name || !email} style={primaryButtonStyle(!name)} onClick={() => setStep(8)}>Отримати повний звіт</button>
        </>
      )}

      {step === 8 && aiResults && (
        <div style={{ background: "#f0fff4", padding: "20px", borderRadius: "12px", border: "2px solid #2f855a" }}>
          <h2 style={{ color: "#2f855a" }}>Результат аналізу для {name}:</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>💧 <b>Здоров'я шкіри:</b> {100 - Math.round(aiResults.health)}%</li>
            <li>✨ <b>Чистота пор:</b> {100 - Math.round(aiResults.pore)}%</li>
            <li>🌸 <b>Відсутність акне:</b> {100 - Math.round(aiResults.acne)}%</li>
            <li>👁️ <b>Зона навколо очей:</b> {100 - Math.round(aiResults.dark_circle)}%</li>
            <li>🧬 <b>Гладкість текстури:</b> {100 - Math.round(aiResults.texture)}%</li>
            <li>☀️ <b>Рівність тону:</b> {100 - Math.round(aiResults.stain)}%</li>
          </ul>
          <p style={{ marginTop: 20, fontWeight: "bold" }}>Рекомендація "Еко красА":</p>
          <p>Вам ідеально підійде наш Оптимальний набір для догляду.</p>
        </div>
      )}
    </main>
  );
}
