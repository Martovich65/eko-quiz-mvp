import { useEffect, useRef, useState } from "react";
import analyzeSkin from "../lib/skinAnalysis";

export default function Quiz() {
  const [step, setStep] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [selfie, setSelfie] = useState(null);

  const [skinType, setSkinType] = useState(null);
  const [problems, setProblems] = useState([]);
  const [ageRange, setAgeRange] = useState(null);
  const [sensitivity, setSensitivity] = useState(null);
  const [offerType, setOfferType] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showProblemError, setShowProblemError] = useState(false);

  const [photoAnalyzing, setPhotoAnalyzing] = useState(false);
  const [photoRejected, setPhotoRejected] = useState(false);

  // Стили
  const optionStyle = (isActive) => ({
    backgroundColor: isActive ? "#2f855a" : "#f4f4f4",
    color: isActive ? "#ffffff" : "#111827",
    border: "1px solid #cfcfcf",
    padding: "14px 16px",
    margin: "8px 0",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "8px",
  });

  const primaryButtonStyle = (disabled = false) => ({
    marginTop: 24,
    width: "100%",
    padding: "16px",
    backgroundColor: disabled ? "#a0aec0" : "#2f855a",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: "bold",
  });

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      setCameraOn(true);
    } catch (error) {
      alert("Дозвольте доступ до камери у браузері.");
    }
  };

  useEffect(() => {
    if (cameraOn && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [cameraOn, stream]);

  const captureSelfie = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setSelfie(canvas.toDataURL("image/jpeg", 0.9));
    if (stream) stream.getTracks().forEach(t => t.stop());
    setCameraOn(false);
  };

  const startPhotoAnalysis = async () => {
    setPhotoAnalyzing(true);
    try {
      const result = await analyzeSkin(selfie);
      if (result && result.passed) {
        setStep(1);
      } else {
        setPhotoRejected(true);
      }
    } catch (e) {
      setPhotoRejected(true);
    }
    setPhotoAnalyzing(false);
  };

  // ЭКРАН АНАЛИЗА
  if (photoAnalyzing) {
    return (
      <main style={{ maxWidth: 600, margin: "40px auto", textAlign: "center", padding: "20px" }}>
        <h2>Аналізуємо ваше обличчя...</h2>
        <p>Це займе всього 3-5 секунд.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#2f855a" }}>Еко красА: AI-Діагностика</h1>

      {step === 0 && (
        <>
          {!selfie && !cameraOn && (
            <button style={primaryButtonStyle()} onClick={startCamera}>Почати сканування обличчя</button>
          )}
          {cameraOn && (
            <>
              <video ref={videoRef} autoPlay playsInline style={{ width: "100%", borderRadius: 12 }} />
              <button style={primaryButtonStyle()} onClick={captureSelfie}>Зробити фото</button>
            </>
          )}
          {selfie && !photoRejected && (
            <>
              <img src={selfie} style={{ width: "100%", borderRadius: 12 }} />
              <button style={primaryButtonStyle()} onClick={startPhotoAnalysis}>Продовжити аналіз</button>
            </>
          )}
          {photoRejected && (
            <div>
              <p>Фото нечітке. Спробуйте ще раз при кращому освітленні.</p>
              <button style={primaryButtonStyle()} onClick={() => {setPhotoRejected(false); setSelfie(null);}}>Спробувати знову</button>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </>
      )}

      {step === 1 && (
        <>
          <h2>Який у вас тип шкіри?</h2>
          {["Суха", "Нормальна", "Комбінована", "Жирна"].map(t => (
            <button key={t} style={optionStyle(skinType === t)} onClick={() => setSkinType(t)}>{t}</button>
          ))}
          <button disabled={!skinType} style={primaryButtonStyle(!skinType)} onClick={() => setStep(7)}>Далі</button>
        </>
      )}

      {step === 7 && (
        <>
          <h2>Ваші контакти</h2>
          <input type="text" placeholder="Ім'я" style={{ width: "100%", padding: 12, marginBottom: 10 }} onChange={e => setName(e.target.value)} />
          <input type="email" placeholder="Email" style={{ width: "100%", padding: 12, marginBottom: 10 }} onChange={e => setEmail(e.target.value)} />
          <button disabled={!name || !email} style={primaryButtonStyle(!name)} onClick={() => alert("Дякуємо! Результати надіслано.")}>Отримати результат</button>
        </>
      )}
    </main>
  );
}
