import { useEffect, useRef, useState } from "react";
import analyzeSkin from "../lib/skinAnalysis";

export default function Quiz() {
  const [step, setStep] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [selfie, setSelfie] = useState(null);
  const [aiResults, setAiResults] = useState(null);
  const [photoAnalyzing, setPhotoAnalyzing] = useState(false);

  // 1. Запуск камеры (без лишних проверок, прямой поток)
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: "user" } 
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      alert("Камера заблокована або не знайдена");
    }
  };

  // 2. Снимок (захват текущего кадра из видеопотока)
  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const imgData = canvas.toDataURL("image/jpeg", 0.9);
      setSelfie(imgData);
      
      // Останавливаем камеру после снимка
      if (stream) stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  // 3. Анализ (отправка в Face++)
  const runAnalysis = async () => {
    setPhotoAnalyzing(true);
    try {
      const res = await analyzeSkin(selfie);
      if (res && res.passed) {
        setAiResults(res.details);
        setStep(1); // К контактам
      } else {
        alert("ИИ не впізнав обличчя. Спробуйте ще раз.");
        setSelfie(null);
        startCamera();
      }
    } catch (e) {
      alert("Помилка сервісу аналізу");
    }
    setPhotoAnalyzing(false);
  };

  if (photoAnalyzing) return <div style={{textAlign:"center", padding:"50px"}}><h2>Аналізуємо...</h2></div>;

  return (
    <main style={{ maxWidth: 500, margin: "20px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#2f855a" }}>Еко красА AI</h1>

      {step === 0 && (
        <div>
          {!cameraActive && !selfie && (
            <button onClick={startCamera} style={btnStyle}>Почати сканування</button>
          )}

          {cameraActive && (
            <div style={{ position: "relative" }}>
              <video ref={videoRef} playsInline style={{ width: "100%", borderRadius: "10px" }} />
              <button onClick={takePhoto} style={snapBtnStyle}>Зробити фото</button>
            </div>
          )}

          {selfie && (
            <div>
              <img src={selfie} style={{ width: "100%", borderRadius: "10px" }} />
              <button onClick={runAnalysis} style={btnStyle}>Аналізувати стан шкіри</button>
              <button onClick={() => { setSelfie(null); startCamera(); }} style={{ ...btnStyle, background: "#ccc" }}>Переробити</button>
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div style={{ background: "#f0fff4", padding: "20px", borderRadius: "12px", border: "2px solid #2f855a" }}>
          <h2>Результати:</h2>
          <p>💧 Здоров'я: {100 - Math.round(aiResults.health)}%</p>
          <p>✨ Пори: {100 - Math.round(aiResults.pore)}%</p>
          <p>🌸 Акне: {100 - Math.round(aiResults.acne)}%</p>
          <p>👁️ Очі: {100 - Math.round(aiResults.dark_circle)}%</p>
          <p>🧬 Текстура: {100 - Math.round(aiResults.texture)}%</p>
          <button onClick={() => window.location.href = 'https://ekokrasa.com.ua'} style={btnStyle}>До магазину</button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </main>
  );
}

const btnStyle = {
  width: "100%", padding: "15px", background: "#2f855a", color: "#fff",
  border: "none", borderRadius: "8px", fontWeight: "bold", marginTop: "10px", cursor: "pointer"
};

const snapBtnStyle = {
  position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)",
  padding: "10px 20px", background: "#fff", border: "none", borderRadius: "50px", fontWeight: "bold"
};
