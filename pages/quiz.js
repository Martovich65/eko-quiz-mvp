import { useEffect, useRef, useState } from "react";
import analyzeSkin from "../lib/skinAnalysis";

export default function Quiz() {
  const [step, setStep] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [selfie, setSelfie] = useState(null);
  const [aiResults, setAiResults] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoAnalyzing, setPhotoAnalyzing] = useState(false);

  const primaryButtonStyle = (disabled = false) => ({
    marginTop: 24, width: "100%", padding: "16px",
    backgroundColor: disabled ? "#a0aec0" : "#2f855a",
    color: "#ffffff", border: "none", borderRadius: "12px",
    cursor: disabled ? "not-allowed" : "pointer", fontWeight: "bold",
  });

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play(); // Принудительный запуск видео
          setCameraOn(true);
          setStream(mediaStream);
        };
      }
    } catch (e) { 
      alert("Помилка камери: перевірте дозволи у браузері."); 
    }
  };

  const captureSelfie = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      setSelfie(canvas.toDataURL("image/jpeg", 0.9));
      if (stream) stream.getTracks().forEach(t => t.stop());
      setCameraOn(false);
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
        alert("ИИ не зміг розпізнати обличчя. Спробуйте ще раз при кращому освітленні."); 
      }
    } catch (e) { 
      alert("Помилка зв'язку з сервером аналізу."); 
    }
    setPhotoAnalyzing(false);
  };

  if (photoAnalyzing) return (
    <main style={{ maxWidth: 500, margin: "40px auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#2f855a" }}>Еко красА AI аналізує шкіру...</h2>
      <p>Це займе всього кілька секунд</p>
    </main>
  );

  return (
    <main style={{ maxWidth: 500, margin: "20px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#2f855a", textAlign: "center" }}>Еко красА</h1>

      {step === 0 && (
        <div style={{ minHeight: "350px" }}>
          {!selfie && !cameraOn && (
            <button style={primaryButtonStyle()} onClick={startCamera}>Почати AI-сканування</button>
          )}
          
          {cameraOn && (
            <div style={{ position: "relative", background: "#000", borderRadius: 12, overflow: "hidden" }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: "100%", display: "block" }} />
              <button style={{ position: "absolute", bottom: 15, left: "50%", transform: "translateX(-50%)", padding: "12px 24px", background: "#fff", border: "none", borderRadius: 8, fontWeight: "bold" }} onClick={captureSelfie}>
                Зробити фото
              </button>
            </div>
          )}

          {selfie && (
            <>
              <img src={selfie} style={{ width: "100%", borderRadius: 12 }} />
              <button style={primaryButtonStyle()} onClick={startPhotoAnalysis}>Аналізувати стан шкіри</button>
              <button style={{ ...primaryButtonStyle(), backgroundColor: "#e2e8f0", color: "#4a5568", marginTop: 10 }} onClick={() => {setSelfie(null); startCamera();}}>Переробити фото</button>
            </>
          )}
        </div>
      )}

      {step === 1 && (
        <div>
          <h2>Майже готово!</h2>
          <p>Вкажіть дані, щоб отримати повний звіт та індивідуальний догляд:</p>
          <input type="text" placeholder="Ваше ім'я" style={{ width: "100%", padding: 14, marginBottom: 12, border: "1px solid #cbd5e0", borderRadius: 8 }} onChange={e => setName(e.target.value)} />
          <input type="email" placeholder="Ваш Email" style={{ width: "100%", padding: 14, marginBottom: 12, border: "1px solid #cbd5e0", borderRadius: 8 }} onChange={e => setEmail(e.target.value)} />
          <button disabled={!name || !email} style={primaryButtonStyle(!name || !email)} onClick={() => setStep(2)}>Отримати результати</button>
        </div>
      )}

      {step === 2 && aiResults && (
        <div style={{ background: "#f0fff4", padding: "24px", borderRadius: "12px", border: "2px solid #2f855a" }}>
          <h2 style={{ color: "#2f855a", marginTop: 0 }}>Аналіз для {name}:</h2>
          <ul style={{ listStyle: "none", padding: 0, fontSize: "18px", lineHeight: "2" }}>
            <li>💧 <b>Здоров'я шкіри:</b> {100 - Math.round(aiResults.health)}%</li>
            <li>✨ <b>Чистота пор:</b> {100 - Math.round(aiResults.pore)}%</li>
            <li>🌸 <b>Відсутність акне:</b> {100 - Math.round(aiResults.acne)}%</li>
            <li>👁️ <b>Зона навколо очей:</b> {100 - Math.round(aiResults.dark_circle)}%</li>
            <li>🧬 <b>Гладкість текстури:</b> {100 - Math.round(aiResults.texture)}%</li>
            <li>☀️ <b>Рівність тону:</b> {100 - Math.round(aiResults.stain)}%</li>
          </ul>
          <hr style={{ border: "0", borderTop: "1px solid #2f855a", margin: "20px 0" }} />
          <p style={{ fontWeight: "bold" }}>Рекомендація "Еко красА":</p>
          <p>На основі AI-сканування вам підібрано індивідуальний бокс для догляду.</p>
          <button style={primaryButtonStyle()} onClick={() => window.location.href = 'https://ekokrasa.com.ua'}>Перейти до підібраних товарів</button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </main>
  );
}
