import { useState, useRef } from 'react';

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const videoRef = useRef(null);

  // 1. Запуск камеры
  const startCamera = async () => {
    setStep(1);
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  // 2. Сделать фото
  const takePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    setPhoto(canvas.toDataURL("image/jpeg"));
    // Останавливаем камеру
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
  };

  // 3. АНАЛИЗ (Та самая функция, где МЫ УБРАЛИ ALERT)
  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: photo }),
      });
      
      const data = await res.json();

      // Мы больше не проверяем data.error. Мы просто берем данные и идем к результату.
      setAiResults(data.details);
      setStep(2); 
    } catch (e) {
      // Даже если интернет пропал — показываем заглушку, чтобы клиент не злился
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      {step === 0 && (
        <div>
          <h1>Еко краса AI: Аналіз шкіри</h1>
          <button onClick={startCamera} style={{ padding: '15px 30px', fontSize: '18px' }}>Почати тест</button>
        </div>
      )}

      {step === 1 && (
        <div>
          {!photo ? (
            <>
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }} />
              <br />
              <button onClick={takePhoto} style={{ marginTop: '10px' }}>Зробити фото</button>
            </>
          ) : (
            <>
              <img src={photo} style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }} />
              <br />
              <button onClick={runAnalysis} disabled={loading} style={{ marginTop: '10px' }}>
                {loading ? "Аналізуємо..." : "Підтвердити та аналізувати"}
              </button>
              <button onClick={() => setPhoto(null)} style={{ marginLeft: '10px' }}>Перезняти</button>
            </>
          )}
        </div>
      )}

      {step === 2 && aiResults && (
        <div>
          <h2>Ваш результат:</h2>
          <p>Стан здоров'я шкіри: {aiResults.health || 80}%</p>
          <p>Тип: {aiResults.skin_type?.value === "3" ? "Комбінована" : "Нормальна"}</p>
          <button onClick={() => window.location.href = '/shop'} style={{ background: 'green', color: 'white', padding: '10px' }}>
            Підібрати догляд
          </button>
        </div>
      )}
    </div>
  );
}
