import { useState, useRef } from 'react';

function normalizeUkrainianMobile(value) {
  const input = value.trim();
  if (!/^\+?[\d\s()./-]+$/.test(input)) return null;

  const compact = input.replace(/[\s()./-]/g, '');
  const national = compact.replace(/^(?:\+380|00380|380)(?=\d{9}$)/, '0');
  if (!/^0(?:67|68|96|97|98|77|50|66|95|99|75|63|73|93)\d{7}$/.test(national)) return null;

  return '+38' + national;
}

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisToken, setAnalysisToken] = useState(null);
  const [resultStatus, setResultStatus] = useState('idle');
  const [answers, setAnswers] = useState({});
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
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

      setAnalysisToken(res.ok && data.success ? data.analysisToken ?? null : null);
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

  const phone = normalizeUkrainianMobile(phoneInput);
  const showPhoneError = !phone && (phoneTouched || phoneInput.length > 0);

  // Проверка email для активации кнопки
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    emailInput.trim()
  );

  const canContinue = Boolean(nameInput.trim() && isEmailValid && phone);

  const openResult = async () => {
    setResultStatus('loading');
    try {
      const { skinType, mainProblem, desiredResult } = answers;
      const response = await fetch('/api/quiz/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisToken, skinType, mainProblem, desiredResult }),
      });
      if (!response.ok) throw new Error('Result unavailable');
      const { url } = await response.json();
      window.location.assign(url);
    } catch {
      setResultStatus('error');
    }
  };

  const saveContact = () => {
    if (!canContinue) return;

    setAnswers((previous) => ({
      ...previous,
      name: nameInput.trim(),
      email: emailInput.trim(),
      phone,
    }));
    setStep(9);
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

      {/* Крок 1 */}
      {step === 2 && (
        <div>
          <h2>Крок 1 із 8</h2>
          <h3>Який у вас тип шкіри?</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '20px auto' }}>
            <button onClick={() => selectSkinType('Жирна')}>Жирна</button>
            <button onClick={() => selectSkinType('Суха')}>Суха</button>
            <button onClick={() => selectSkinType('Комбінована')}>Комбінована</button>
            <button onClick={() => selectSkinType('Нормальна')}>Нормальна</button>
          </div>
        </div>
      )}

      {/* Крок 2 */}
      {step === 3 && (
        <div>
          <h2>Крок 2 із 8</h2>
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

      {/* Крок 3 */}
      {step === 4 && (
        <div>
          <h2>Крок 3 із 8</h2>
          <h3>Як шкіра реагує на воду?</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '20px auto' }}>
            <button onClick={() => selectWaterReaction('Стягнутість')}>Стягнутість</button>
            <button onClick={() => selectWaterReaction('Почервоніння')}>Почервоніння</button>
            <button onClick={() => selectWaterReaction('Жирний блиск')}>Жирний блиск</button>
            <button onClick={() => selectWaterReaction('Норма')}>Норма</button>
          </div>
        </div>
      )}

      {/* Крок 4 */}
      {step === 5 && (
        <div>
          <h2>Крок 4 із 8</h2>
          <h3>Який результат ви хочете отримати?</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '20px auto' }}>
            <button onClick={() => selectDesiredResult('Сяйво')}>Сяйво</button>
            <button onClick={() => selectDesiredResult('Чиста шкіра')}>Чиста шкіра</button>
            <button onClick={() => selectDesiredResult('Омолодження')}>Омолодження</button>
          </div>
        </div>
      )}

      {/* Крок 5 */}
      {step === 6 && (
        <div>
          <h2>Крок 5 із 8</h2>
          <h3>Оберіть вашу вікову категорію</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '20px auto' }}>
            <button onClick={() => selectAge('до 25')}>до 25</button>
            <button onClick={() => selectAge('25-35')}>25-35</button>
            <button onClick={() => selectAge('35-45')}>35-45</button>
            <button onClick={() => selectAge('45+')}>45+</button>
          </div>
        </div>
      )}

      {/* Крок 6 */}
      {step === 7 && (
        <div>
          <h2>Крок 6 із 8</h2>
          <h3>Чи є у вас алергії?</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '20px auto' }}>
            <button onClick={() => selectAllergies('Так')}>Так</button>
            <button onClick={() => selectAllergies('Ні')}>Ні</button>
          </div>
        </div>
      )}

      {/* Крок 7 */}
      {step === 8 && (
        <div>
          <h2>Крок 7 із 8</h2>
          <h3>Введіть ваші контактні дані</h3>

          <div style={{ maxWidth: '320px', margin: '0 auto 14px', textAlign: 'left' }}>
            <label htmlFor="quiz-name" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Ваше ім'я
            </label>
            <input
              id="quiz-name"
              type="text"
              autoComplete="given-name"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              required
              style={{ boxSizing: 'border-box', width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' }}
            />
          </div>

          <div style={{ maxWidth: '320px', margin: '0 auto 14px', textAlign: 'left' }}>
            <label htmlFor="quiz-email" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              E-mail
            </label>
            <input
              id="quiz-email"
              type="email"
              autoComplete="email"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
              placeholder="example@email.com"
              required
              style={{ boxSizing: 'border-box', width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' }}
            />
          </div>

          <div style={{ maxWidth: '320px', margin: '4px auto 14px', textAlign: 'left' }}>
            <label htmlFor="quiz-phone" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Номер мобільного телефону
            </label>
            <input
              id="quiz-phone"
              type="tel"
              autoComplete="tel"
              value={phoneInput}
              onChange={(event) => setPhoneInput(event.target.value)}
              onBlur={() => setPhoneTouched(true)}
              placeholder="+380 67 123 45 67"
              required
              aria-invalid={showPhoneError}
              aria-describedby={showPhoneError ? 'quiz-phone-error' : undefined}
              style={{
                boxSizing: 'border-box',
                padding: '12px',
                width: '100%',
                borderRadius: '6px',
                border: showPhoneError ? '1px solid #a1213a' : '1px solid #ccc',
                fontSize: '16px',
              }}
            />
            {showPhoneError && (
              <p id="quiz-phone-error" style={{ color: '#a1213a', margin: '6px 0 0' }}>
                Введіть український мобільний номер, наприклад +380 67 123 45 67.
              </p>
            )}
          </div>

          <button
            onClick={saveContact}
            disabled={!canContinue}
          >
            Далі
          </button>
        </div>
      )}

      {/* Экран проверки */}
      {step === 9 && (
        <div>
          <p>Крок 8 із 8</p>
          <h2 style={{ maxWidth: '540px', margin: '0 auto 24px', fontSize: 'clamp(24px, 5vw, 32px)', lineHeight: 1.25, color: '#2f2c3e' }}>
            Перевірте свої відповіді та підтвердіть, що вони справжні
          </h2>

          <p><strong>Тип шкіри:</strong> {answers.skinType}</p>
          <p><strong>Головна проблема:</strong> {answers.mainProblem}</p>
          <p><strong>Реакція на воду:</strong> {answers.waterReaction}</p>
          <p><strong>Бажаний результат:</strong> {answers.desiredResult}</p>
          <p><strong>Вік:</strong> {answers.age}</p>
          <p><strong>Алергії:</strong> {answers.hasAllergies}</p>
          <p><strong>Ім'я:</strong> {answers.name}</p>
          <p><strong>E-mail:</strong> {answers.email}</p>
          <p><strong>Номер телефону:</strong> {answers.phone}</p>

          <button
            type="button"
            onClick={openResult}
            disabled={resultStatus === 'loading'}
            style={{
              width: '100%',
              maxWidth: '360px',
              minHeight: '48px',
              marginTop: '12px',
              padding: '12px 20px',
              border: 0,
              borderRadius: '10px',
              backgroundColor: '#63213f',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {resultStatus === 'loading' ? 'Готуємо результат…' : 'Підтвердити й побачити результат'}
          </button>
          {resultStatus === 'error' && <p role="alert">Не вдалося відкрити результат. Спробуйте ще раз.</p>}
        </div>
      )}
    </div>
  );
}
