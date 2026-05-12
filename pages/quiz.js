import { useState, useRef } from 'react';

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [answers, setAnswers] = useState({});
  const videoRef = useRef(null);

  // 1. Запуск камеры
  const startCamera = async () => {
    setStep(1);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  // 2. Сделать фото
  const takePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    canvas
      .getContext('2d')
      .drawImage(videoRef.current, 0, 0);

    setPhoto(canvas.toDataURL('image/jpeg'));

    // Останавливаем камеру
    videoRef.current.srcObject
      .getTracks()
      .forEach((track) => track.stop());
  };

  // 3. Анализ фото
  const runAnalysis = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: photo,
        }),
      });

      const data = await res.json();

      setAiResults(data.details);
      setStep(2); // Переходим к анкете
    } catch (e) {
      // Даже если произошла ошибка — продолжаем
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // Сохранение ответа на вопрос
  const saveAnswer = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Выбор типа кожи
  const selectSkinType = (value) => {
    saveAnswer('skinType', value);
    alert('Обраний тип шкіри: ' + value);
  };

  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Стартовый экран */}
      {step === 0 && (
        <div>
          <h1>Еко краса AI: Аналіз шкіри</h1>

          <button
            onClick={startCamera}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
            }}
          >
            Почати тест
          </button>
        </div>
      )}

      {/* Камера */}
      {step === 1 && (
        <div>
          {!photo ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  borderRadius: '10px',
                }}
              />

              <br />

              <button
                onClick={takePhoto}
                style={{
                  marginTop: '10px',
                }}
              >
                Зробити фото
              </button>
            </>
          ) : (
            <>
              <img
                src={photo}
                alt="Фото"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  borderRadius: '10px',
                }}
              />

              <br />

              <button
                onClick={runAnalysis}
                disabled={loading}
                style={{
                  marginTop: '10px',
                }}
              >
                {loading
                  ? 'Аналізуємо...'
                  : 'Підтвердити та аналізувати'}
              </button>

              <button
                onClick={() => setPhoto(null)}
                style={{
                  marginLeft: '10px',
                }}
              >
                Перезняти
              </button>
            </>
          )}
        </div>
      )}

      {/* Шаг 1 анкеты */}
      {step === 2 && (
        <div>
          <h2>Крок 1 із 9</h2>
          <h3>Який у вас тип шкіри?</h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              maxWidth: '300px',
              margin: '20px auto',
            }}
          >
            <button onClick={() => selectSkinType('Жирна')}>
              Жирна
            </button>

            <button onClick={() => selectSkinType('Суха')}>
              Суха
            </button>

            <button onClick={() => selectSkinType('Комбінована')}>
              Комбінована
            </button>

            <button onClick={() => selectSkinType('Нормальна')}>
              Нормальна
            </button>
          </div>

          {answers.skinType && (
            <p>
              Обрано: <strong>{answers.skinType}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
