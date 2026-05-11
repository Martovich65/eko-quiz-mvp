import { useEffect, useRef, useState } from "react";

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
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
      setStream(s);
    } catch (err) {
      alert("Дозвольте доступ до камери");
      setCameraActive(false);
    }
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const imgData = canvas.toDataURL("image/jpeg", 0.9);
      setSelfie(imgData);
      if (stream) stream.getTracks().forEach(t => t.stop());
      setCameraActive(false);
    }
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: selfie })
      });
      const data = await response.json();
      if (data.passed && data.details) {
        // Успешный выход из цикла ошибки Screenshot_35
        setAiResults(data.details);
        setStep(1);
      } else {
        alert("Face++ не зміг обробити це фото. Спробуйте інше освітлення.");
        setSelfie(null);
        startCamera();
      }
    } catch (err) {
      alert("Помилка з'єднання з Face++");
    }
    setLoading(false);
  };

  if (loading) return <div style={{textAlign:"center", marginTop:"100px"}}><h2>Еко красА AI аналізує...</h2></div>;

  return (
    <main style={{ maxWidth: 500, margin: "20px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#2f855a" }}>Еко красА</h1>

      {step === 0 && (
        <div style={{ textAlign: "center" }}>
          <div style={{ display: cameraActive ? "block" : "none", position: "relative" }}>
            <video ref={videoRef} muted playsInline autoPlay style={{ width: "100%", borderRadius: "15px" }} />
            <button onClick={takePhoto} style={snapBtnStyle}>Зробити фото</button>
          </div>

          {!cameraActive && !selfie && (
            <button onClick={startCamera} style={btnStyle}>Почати AI-сканування</button>
          )}

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
          <h2 style={{ color: "#2f855a" }}>Ваш результат:</h2>
          <ul style={{ listStyle: "none", padding: 0, fontSize: "18px", lineHeight: "2" }}>
            <li>💧 Здоров'я шкіри: {100 - Math.round(aiResults.skin.health || 0)}%</li>
            <li>✨ Чистота пор: {100 - Math.round(aiResults.skin.pore || 0)}%</li>
            <li>🌸 Відсутність акне: {100 - Math.round(aiResults.skin.acne || 0)}%</li>
            <li>🧬 Текстура: {100 - Math.round(aiResults.skin.texture || 0)}%</li>
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
  padding: "12px 25px", background: "#fff", border: "none", borderRadius: "30px", fontWeight: "bold", cursor: "pointer"
};
