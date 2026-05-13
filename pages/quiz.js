import { useState, useRef } from 'react';

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [answers, setAnswers] = useState({});
  const videoRef = useRef(null);

  // Запуск камеры
  const startCamera = async () => {
    setStep(1);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  // Сделать фото
  const takePhoto = () => {
    const canvas = document.createElement('canvas');

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

    setPhoto(canvas.toDataURL('image/jpeg'));

    // Останавливаем камеру
    videoRef.current.srcObject
      .getTracks()
      .forEach((track) => track.stop());
  };

  // Анализ фото
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
      setStep(2);
    } catch (e) {
      // Даже при ошибке продолжаем
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // Сохранение ответа
  const saveAnswer = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Крок 1
  const selectSkinType = (value) => {
    saveAnswer('skinType', value);
    setStep(3);
  };

  // Крок 2
  const selectMainProblem = (value) => {
    saveAnswer('mainProblem', value);
    setStep(4);
  };

  // Крок 3
  const selectWaterReaction = (value) => {
    saveAnswer('waterReaction', value);
    setStep(5);
  };

  // Крок 4
  const selectDesiredResult = (value) => {
    saveAnswer('desiredResult', value);
    setStep(6);
  };

  // Крок 5
  const selectAge = (value) => {
    saveAnswer('age', value);
    setStep(7);
  };

  // Крок 6
  const selectAllergies = (value) => {
    saveAnswer('hasAllergies', value);
    setStep(8);
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
                style={{ marginTop: '10px' }}
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
                style={{ marginTop: '10px' }}
              >
                {loading
                  ? 'Аналізуємо...'
                  : 'Підтвердити та аналізувати'}
              </button>

              <button
                onClick={() => setPhoto(null)}
                style={{ marginLeft: '10px' }}
              >
                Перезняти
              </button>
            </>
          )}
        </div>
      )}

      {/* Крок 1 із 9 */}
      {step === 2 && (
        <div>
          <h2>Крок 1 із 9</h2>
          <h3>Який у вас тип шкіри?</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '20px auto' }}>
            <button onClick={() => selectSkinType('Жирна')}>Жирна</button>
            <button onClick={() => selectSkinType('Суха')}>Суха</button>
            <button onClick={() => selectSkinType('Комбінована')}>Комбінована</button>
            <button onClick={() => selectSkinType('Нормальна')}>Нормальна</button>
          </div>
        </div>
      )}

      {/* Крок 2 із 9 */}
      {step === 3 && (
        <div>
          <h2>Крок 2 із 9</h2>
          <h3>Яка ваша головна проблема?</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '20px auto' }}>
            <button onClick={() => selectMainProblem('Акне / Висипання')}>Акне / Висипання</button>
            <button onClick={() => selectMainProblem('Постакне')}>Постакне</button>
            <button onClick={() => selectMainProblem('Розширені пори')}>Розширені пори</button>
            <button onClick={() => selectMainProblem('Купероз')}>Купероз</button>
            <button onClick={() => selectMainProblem('Зморшки')}>Зморшки</button>
            <button onClick={() => selectMainProblem('Чутливість')}>Чутливість</button>
            <button onClick={() => selectMainProblem('Пігментація')}>Пігментація</button>
            <button onClick={() => selectMainProblem('Набряки')}>Набряки</button>
            <button onClick={() => selectMainProblem('Тьмяний колір')}>Тьмяний колір</button>
          </div>
        </div>
      )}

      {/* Крок 3 із 9 */}
      {step === 4 && (
        <div>
          <h2>Крок 3 із 9</h2>
          <h3>Як шкіра реагує на воду?</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '20px auto' }}>
            <button onClick={() => selectWaterReaction('Стягнутість')}>Стягнутість</button>
            <button onClick={() => selectWaterReaction('Почервоніння')}>Почервоніння</button>
            <button onClick={() => selectWaterReaction('Жирний блиск')}>Жирний блиск</button>
            <button onClick={() => selectWaterReaction('Норма')}>Норма</button>
          </div>
        </div>
      )}

      {/* Крок 4 із 9 */}
      {step === 5 && (
        <div>
          <h2>Крок 4 із 9</h2>
          <h3>Який результат ви хочете отримати?</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '20px auto' }}>
            <button onClick={() => selectDesiredResult('Сяйво')}>Сяйво</button>
            <button onClick={() => selectDesiredResult('Чиста шкіра')}>Чиста шкіра</button>
            <button onClick={() => selectDesiredResult('Омолодження')}>Омолодження</button>
          </div>
        </div>
      )}

      {/* Крок 5 із 9 */}
      {step === 6 && (
        <div>
          <h2>Крок 5 із 9</h2>
          <h3>Оберіть вашу вікову категорію</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '20px auto' }}>
            <button onClick={() => selectAge('до 25')}>до 25</button>
            <button onClick={() => selectAge('25-35')}>25-35</button>
            <button onClick={() => selectAge('35-45')}>35-45</button>
            <button onClick={() => selectAge('45+')}>45+</button>
          </div>
        </div>
      )}

      {/* Крок 6 із 9 */}
      {step === 7 && (
        <div>
          <h2>Крок 6 із 9</h2>
          <h3>Чи є у вас алергії?</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '20px auto' }}>
            <button onClick={() => selectAllergies('Так')}>Так</button>
            <button onClick={() => selectAllergies('Ні')}>Ні</button>
          </div>
        </div>
      )}

      {/* Временный экран проверки */}
      {step === 8 && (
        <div>
          <h2>Відповіді збережено ✅</h2>

          <p><strong>Тип шкіри:</strong> {answers.skinType}</p>
          <p><strong>Головна проблема:</strong> {answers.mainProblem}</p>
          <p><strong>Реакція на воду:</strong> {answers.waterReaction}</p>
          <p><strong>Бажаний результат:</strong> {answers.desiredResult}</p>
          <p><strong>Вік:</strong> {answers.age}</p>
          <p><strong>Алергії:</strong> {answers.hasAllergies}</p>

          <p>Далі буде Крок 7 із 9.</p>
        </div>
      )}
    </div>
  );
}
