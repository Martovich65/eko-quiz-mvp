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
  const [loading, setLoading] = useState(false);

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        // Ждем готовности видео и запускаем
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => console.error("Play error:", e));
        };
      }
      setStream(s);
    } catch (err) {
      console.error(err);
      alert("Дозвольте доступ до камери у налаштуваннях браузера");
      setCameraActive(false);
    }
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      
      const imgData = canvas.toDataURL("image/jpeg", 0.9);
      setSelfie(imgData);
      
      // Выключаем поток
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setCameraActive(false);
      setStream(null);
    }
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await analyzeSkin(selfie);
      if (res && res.passed) {
        setAiResults(res.details);
        setStep(1);
      } else {
        alert("ИИ не розпізнав обличчя. Зробіть фото чіткіше.");
        setSelfie(null);
        startCamera();
      }
    } catch (e) {
      alert("Помилка зв'язку з сервером Face++");
    }
    setLoading(false);
  };

  if (loading) return <div style={centerStyle}><h2>Еко красА AI аналізує...</h2></div>;

  return (
    <main style={{ maxWidth: 500, margin: "20px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#2f855a", marginBottom: "30px" }}>Еко красА</h1>

      {step === 0 && (
        <div style={{ textAlign: "center" }}>
          {/* Блок видео */}
          <div style={{ display: cameraActive ? "block" : "none", position: "relative", background: "#000", borderRadius: "15px", overflow: "hidden" }}>
            <video 
              ref={videoRef} 
              muted 
              playsInline 
              autoPlay 
              style={{ width: "100%", display: "block" }} 
            />
            <button onClick={takePhoto} style={snapBtnStyle}>Зробити фото</button>
          </div>

          {/* Начальная кнопка */}
          {!cameraActive && !selfie && (
            <button onClick={startCamera} style={btnStyle}>Почати AI-сканування</button>
          )}

          {/* Превью снимка */}
          {selfie && !cameraActive && (
            <div>
              <img src={selfie} style={{ width: "100%", borderRadius: "15px" }} />
              <button onClick={runAnalysis} style={btnStyle}>Аналізувати стан шкіри</button>
              <button onClick={() => { setSelfie(null); startCamera(); }} style={{ ...btnStyle, background: "#e2e8f0", color: "#4a5568" }}>Переробити</button>
            </div>
          )}
        </div>
      )}

      {step === 1 && aiResults && (
        <div style={{ background: "#f0fff4", padding: "25px", borderRadius: "15px", border: "2px solid #2f855a" }}>
          <h2 style={{ color: "#2f855a", marginTop: 0 }}>Ваш результат:</h2>
          <ul style={{ listStyle: "none", padding: 0, fontSize: "18px", lineHeight: "2" }}>
            <li>💧 Здоров'я шкіри: {100 - Math.round(aiResults.health)}%</li>
            <li>✨ Чистота пор: {100 - Math.round(aiResults.pore)}%</li>
            <li>🌸 Відсутність акне: {100 - Math.round(aiResults.acne)}%</li>
            <li>🧬 Текстура: {100 - Math.round(aiResults.texture)}%</li>
          </ul>
          <button onClick={() => window.location.href = 'https://ekokrasa.com.ua'} style={btnStyle}>Підібрати догляд</button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </main>
  );
}

const btnStyle = {
  width: "100%", padding: "18px", background: "#2f855a", color: "#fff",
  border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", marginTop: "10px"
};

const snapBtnStyle = {
  position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)",
  padding: "12px 25px", background: "#fff", border: "none", borderRadius: "30px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
};

const centerStyle = { textAlign: "center", marginTop: "100px", fontFamily: "sans-serif" };
