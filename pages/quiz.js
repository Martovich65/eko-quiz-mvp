# pages/quiz.js

Полностью замените содержимое файла `pages/quiz.js` следующим кодом.

```javascript
import { useState, useRef } from 'react';

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiResults, setAiResults] = useState(null);
  const [answers, setAnswers] = useState({});

  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      setStep(1);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setPhoto(imageData);

    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

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
      setAiResults(data.details || null);
      setStep(2);
    } catch (error) {
      console.error('Analyze error:', error);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const saveAnswer = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const selectSkinType = (value) => {
    saveAnswer('skinType', value);
    setStep(3);
  };

  const selectMainProblem = (value) => {
    saveAnswer('mainProblem', value);
    setStep(4);
  };

  const selectWaterReaction = (value) => {
    saveAnswer('waterReaction', value);
    setStep(5);
  };

  const selectDesiredResult = (value) => {
    saveAnswer('desiredResult', value);
    setStep(6);
  };

  const selectAge = (value) => {
    saveAnswer('age', value);
    setStep(7);
  };

  const selectAllergies = (value) => {
    saveAnswer('hasAllergies', value);
    setStep(8);
  };

  const saveName = () => {
    const name = nameInput.trim();
    if (!name) return;

    saveAnswer('name', name);
    setStep(9);
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(emailInput.trim());

  const saveEmail = () => {
    const email = emailInput.trim();
    if (!isEmailValid) return;

    saveAnswer('email', email);
    setStep(10);
  };

  const savePhone = () => {
    const phone = phoneInput.trim();
    if (!phone) return;

    saveAnswer('phone', phone);
    setStep(11);
  };

  const buttonGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '320px',
    margin: '20px auto',
  };

  const inputStyle = {
    padding: '12px',
    width: '100%',
    maxWidth: '320px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'sans-serif',
      }}
    >
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

      {step === 1 && (
        <div>
          {!photo ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  borderRadius: '10px',
                }}
              />

              <br />

              <button onClick={takePhoto} style={{ marginTop: '10px' }}>
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

      {step === 2 && (
        <div>
          <h2>Крок 1 із 9</h2>
          <h3>Який у вас тип шкіри?</h3>

          <div style={buttonGroupStyle}>
            <button onClick={() => selectSkinType('Жирна')}>Жирна</button>
            <button onClick={() => selectSkinType('Суха')}>Суха</button>
            <button onClick={() => selectSkinType('Комбінована')}>
              Комбінована
            </button>
            <button onClick={() => selectSkinType('Нормальна')}>
              Нормальна
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Крок 2 із 9</h2>
          <h3>Яка ваша головна проблема?</h3>

          <div style={buttonGroupStyle}>
            <button onClick={() => selectMainProblem('Акне / Висипання')}>
              Акне / Висипання
            </button>
            <button onClick={() => selectMainProblem('Постакне')}>
              Постакне
            </button>
            <button onClick={() => selectMainProblem('Розширені пори')}>
              Розширені пори
            </button>
            <button onClick={() => selectMainProblem('Купероз')}>
              Купероз
            </button>
            <button onClick={() => selectMainProblem('Зморшки')}>
              Зморшки
            </button>
            <button onClick={() => selectMainProblem('Чутливість')}>
              Чутливість
            </button>
            <button onClick={() => selectMainProblem('Пігментація')}>
              Пігментація
            </button>
            <button onClick={() => selectMainProblem('Набряки')}>
              Набряки
            </button>
            <button onClick={() => selectMainProblem('Тьмяний колір')}>
              Тьмяний колір
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2>Крок 3 із 9</h2>
          <h3>Як шкіра реагує на воду?</h3>

          <div style={buttonGroupStyle}>
            <button onClick={() => selectWaterReaction('Стягнутість')}>
              Стягнутість
            </button>
            <button onClick={() => selectWaterReaction('Почервоніння')}>
              Почервоніння
            </button>
            <button onClick={() => selectWaterReaction('Жирний блиск')}>
              Жирний блиск
            </button>
            <button onClick={() => selectWaterReaction('Норма')}>
              Норма
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2>Крок 4 із 9</h2>
          <h3>Який результат ви хочете отримати?</h3>

          <div style={buttonGroupStyle}>
            <button onClick={() => selectDesiredResult('Сяйво')}>
              Сяйво
            </button>
            <button onClick={() => selectDesiredResult('Чиста шкіра')}>
              Чиста шкіра
            </button>
            <button onClick={() => selectDesiredResult('Омолодження')}>
              Омолодження
            </button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div>
          <h2>Крок 5 із 9</h2>
          <h3>Оберіть вашу вікову категорію</h3>

          <div style={buttonGroupStyle}>
            <button onClick={() => selectAge('до 25')}>до 25</button>
            <button onClick={() => selectAge('25-35')}>25-35</button>
            <button onClick={() => selectAge('35-45')}>35-45</button>
            <button onClick={() => selectAge('45+')}>45+</button>
          </div>
        </div>
      )}

      {step === 7 && (
        <div>
          <h2>Крок 6 із 9</h2>
          <h3>Чи є у вас алергії?</h3>

          <div style={buttonGroupStyle}>
            <button onClick={() => selectAllergies('Так')}>Так</button>
            <button onClick={() => selectAllergies('Ні')}>Ні</button>
          </div>
        </div>
      )}

      {step === 8 && (
        <div>
          <h2>Крок 7 із 9</h2>
          <h3>Введіть ваше ім'я</h3>

          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Ваше ім'я"
            style={inputStyle}
          />

          <br />

          <button onClick={saveName} disabled={!nameInput.trim()}>
            Далі
          </button>
        </div>
      )}

      {step === 9 && (
        <div>
          <h2>Крок 8 із 9</h2>
          <h3>Введіть ваш E-mail</h3>

          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="example@email.com"
            style={inputStyle}
          />

          <br />

          <button onClick={saveEmail} disabled={!isEmailValid}>
            Далі
          </button>
        </div>
      )}

      {step === 10 && (
        <div>
          <h2>Крок 9 із 9</h2>
          <h3>Введіть номер телефону</h3>

          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="+380XXXXXXXXX"
            style={inputStyle}
          />

          <br />

          <button
            onClick={savePhone}
            disabled={!phoneInput.trim()}
          >
            Завершити тест
          </button>
        </div>
      )}

      {step === 11 && (
        <div>
          <h2>Анкету успішно заповнено ✅</h2>

          <p><strong>Тип шкіри:</strong> {answers.skinType}</p>
          <p><strong>Головна проблема:</strong> {answers.mainProblem}</p>
          <p><strong>Реакція на воду:</strong> {answers.waterReaction}</p>
          <p><strong>Бажаний результат:</strong> {answers.desiredResult}</p>
          <p><strong>Вік:</strong> {answers.age}</p>
          <p><strong>Алергії:</strong> {answers.hasAllergies}</p>
          <p><strong>Ім'я:</strong> {answers.name}</p>
          <p><strong>E-mail:</strong> {answers.email}</p>
          <p><strong>Телефон:</strong> {answers.phone}</p>

          <p>🎉 Усі 9 кроків завершено.</p>
        </div>
      )}
    </div>
  );
}
```
