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

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraOn(true);
      }
    } catch (e) { alert("Помилка камери: " + e.message); }
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
    const result = await analyzeSkin(selfie);
    if (result && result.passed) {
      setAiResults(result.details);
      setStep(1);
    } else { alert("Помилка аналізу. Спробуйте ще раз."); }
    setPhotoAnalyzing(false);
  };

  return (
    <main style={{ maxWidth: 500, margin: "20px auto", padding: "20px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#2f855a" }}>Еко красА</h1>
      
      {step === 0 && (
        <div style={{ minHeight: "300px", display: "flex", flexDirection: "column", gap: "15px" }}>
          {!cameraOn && !selfie && (
            <button style={{ padding: "15px", background: "#2f855a", color: "#fff", borderRadius: "10px" }} onClick={startCamera}>
              Почати AI-сканування
            </button>
          )}

          {cameraOn && (
            <div style={{ position: "relative", width: "100%", background: "#000", borderRadius: "12px", overflow: "hidden" }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: "100%", display: "block" }} />
              <button style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", padding: "10px 20px", background: "#fff", borderRadius: "5px" }} onClick={captureSelfie}>
                Зробити фото
              </button>
            </div>
          )}

          {selfie && (
            <div style={{ width: "100%" }}>
              <img src={selfie} style={{ width: "100%", borderRadius: "12px" }} />
              <button style={{ marginTop: "15px", width: "100%", padding: "15px", background: "#2f855a", color: "#fff", borderRadius: "10px" }} onClick={startPhotoAnalysis} disabled={photoAnalyzing}>
                {photoAnalyzing ? "Аналізуємо..." : "Аналізувати стан шкіри"}
              </button>
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div>
          <h2>Ваші контакти</h2>
          <input type="text" placeholder="Ім'я" style={{ width: "100%", padding: "10px", margin: "10px 0" }} onChange={e => setName(e.target.value)} />
          <input type="email" placeholder="Email" style={{ width: "100%", padding: "10px", margin: "10px 0" }} onChange={e => setEmail(e.target.value)} />
          <button style={{ width: "100%", padding: "15px", background: "#2f855a", color: "#fff" }} onClick={() => setStep(2)}>Результати</button>
        </div>
      )}

      {step === 2 && aiResults && (
        <div style={{ textAlign: "left", background: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
          <h3>Результат для {name}:</h3>
          <p>💧 Здоров'я: {100 - Math.round(aiResults.health)}%</p>
          <p>✨ Пори: {100 - Math.round(aiResults.pore)}%</p>
          <p>🌸 Акне: {100 - Math.round(aiResults.acne)}%</p>
          <p>👁️ Кола під очима: {100 - Math.round(aiResults.dark_circle)}%</p>
          <p>🧬 Текстура: {100 - Math.round(aiResults.texture)}%</p>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </main>
  );
}
