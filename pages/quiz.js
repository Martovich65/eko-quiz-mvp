// pages/quiz.js
// Полностью замените содержимое файла этим кодом.

import { useEffect, useRef, useState } from "react";
import analyzeSkin from "../lib/skinAnalysis";

export default function Quiz() {
  const [step, setStep] = useState(0);

  const videoRef = useRef(null);
  
  const canvasRef = useRef(null);
  if (photoAnalyzing) {
  return (
    <div style={containerStyle}>
    {photoAnalyzing && (
  <>
    <h1>Онлайн-діагностика шкіри</h1>
    <h2>Аналізуємо ваше фото...</h2>
    <p>Будь ласка, зачекайте 3–5 секунд.</p>
  </>
)}
      <h1>Онлайн-діагностика шкіри</h1>
      <h2>Аналізуємо ваше фото...</h2>
      <p>Будь ласка, зачекайте 3–5 секунд.</p>
    </div>
  );
}

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

  const phoneRegex = /^(?:\\+380\\d{9}|0\\d{9}|\\d{10})$/;
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

  const isPhoneValid = phoneRegex.test(phone.trim());
  const isEmailValid = emailRegex.test(email.trim());
  const isStep7Valid = name.trim() && isPhoneValid && isEmailValid;

  const optionStyle = (isActive) => ({
    appearance: "none",
    backgroundColor: isActive ? "#2f855a" : "#f4f4f4",
    color: isActive ? "#ffffff" : "#111827",
    border: "1px solid #cfcfcf",
    padding: "14px 16px",
    margin: "8px 0",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: 1.4,
    borderRadius: 0,
  });

  const primaryButtonStyle = (disabled = false) => ({
    marginTop: 24,
    width: "100%",
    padding: "16px",
    backgroundColor: disabled ? "#a0aec0" : "#2f855a",
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: 600,
    border: "none",
    borderRadius: "12px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
  });

  const startCamera = async () => {
    // Если приложение открыто внутри iframe Shopify Admin,
    // браузер может блокировать доступ к камере.
    if (window.self !== window.top) {
      alert(
        "Камера не працює всередині адміністративної панелі Shopify. Квіз буде відкрито в новій вкладці, де камера працюватиме коректно."
      );
      window.open(window.location.href, "_blank");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(mediaStream);
      setCameraOn(true);
    } catch (error) {
      alert(
        "Не вдалося отримати доступ до камери. Дозвольте доступ до камери у браузері та спробуйте ще раз."
      );
    }
  };

  useEffect(() => {
    if (cameraOn && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraOn, stream]);

  useEffect(() => {
    if (photoAnalyzing) {
  return (
    <main
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: "0 16px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Онлайн-діагностика шкіри</h1>
      <h2>Аналізуємо ваше фото…</h2>

      {selfie && (
        <img
          src={selfie}
          alt="Selfie"
          style={{
            width: "100%",
            borderRadius: 12,
            marginTop: 20,
            marginBottom: 24,
          }}
        />
      )}

      <p>Оцінюємо якість фото. Будь ласка, зачекайте 3–5 секунд…</p>
    </main>
  );
}

if (photoRejected) {
  return (
    <main
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: "0 16px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Онлайн-діагностика шкіри</h1>
      <h2>Фото потребує повторного знімка</h2>

      {selfie && (
        <img
          src={selfie}
          alt="Selfie"
          style={{
            width: "100%",
            borderRadius: 12,
            marginTop: 20,
            marginBottom: 24,
          }}
        />
      )}

      <p>
        • Зніміть окуляри.
        <br />
        • Покращіть освітлення.
        <br />
        • Наблизьте обличчя до камери.
      </p>

      <button
        type="button"
        style={primaryButtonStyle(false)}
        onClick={() => {
          setPhotoRejected(false);
          setSelfie(null);
          setCameraOn(false);
        }}
      >
        Зробити фото повторно
      </button>

      <button
        type="button"
        style={{
          ...primaryButtonStyle(false),
          marginTop: 12,
          backgroundColor: "#1f2937",
        }}
        onClick={() => {
          setPhotoRejected(false);
          setStep(1);
        }}
      >
        Продовжити без повторного фото
      </button>
    </main>
  );
}
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setCameraOn(false);
  };

  const captureSelfie = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    setSelfie(imageData);
    stopCamera();
  };
const startPhotoAnalysis = async () => {
  if (!selfie) return;

  setPhotoAnalyzing(true);
  setPhotoRejected(false);

  try {
    // Имитация короткого сканирования
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const result = await analyzeSkin(selfie);

    setPhotoAnalyzing(false);

    // Если фото не прошло проверку качества
    if (!result.photoQuality.passed) {
      setPhotoRejected(true);
      return;
    }

    // Фото хорошее — переходим к вопросам
    setStep(1);
  } catch (error) {
    console.error("Skin analysis error:", error);
    setPhotoAnalyzing(false);
    setPhotoRejected(true);
  }
};
  return (
    <main
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: "0 16px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Онлайн-діагностика шкіри</h1>

      {step === 0 && (
        <>
          <h2>Зробіть селфі</h2>
          <p>Зробіть фото обличчя для персоналізованих рекомендацій.</p>

          {!cameraOn && !selfie && (
            <button type="button" style={primaryButtonStyle(false)} onClick={startCamera}>
              Зробити селфі
            </button>
          )}

          {cameraOn && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: "100%", marginTop: 16, borderRadius: 12 }}
              />
              <button type="button" style={primaryButtonStyle(false)} onClick={captureSelfie}>
                Зробити фото
              </button>
            </>
          )}

          {selfie && !photoAnalyzing && !photoRejected && (
            <>
              <img
                src={selfie}
                alt="Ваше селфі"
                style={{ width: "100%", marginTop: 16, borderRadius: 12 }}
              />
              <button type="button" style={primaryButtonStyle(false)} onClick={startPhotoAnalysis}>
                Продовжити
              </button>
            </>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </>
      )}

      {step === 1 && (
        <>
          <h2>Питання 1 з 6</h2>
          <p>Який у вас тип шкіри?</p>
          {["Суха", "Нормальна", "Комбінована", "Жирна", "Важко сказати"].map((type) => (
            <button
              key={type}
              type="button"
              style={optionStyle(skinType === type)}
              onClick={() => setSkinType(type)}
            >
              {type}
            </button>
          ))}
          <button
            style={primaryButtonStyle(!skinType)}
            disabled={!skinType}
            onClick={() => setStep(2)}
          >
            Продовжити
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Питання 2 з 6</h2>
          <p><strong>Які проблеми шкіри вас турбують зараз?</strong></p>

          {["Сухість / стягнутість", "Зморшки", "Пігментація", "Постакне", "Чорні цятки / пори", "Акне / прищі"].map((problem) => (
            <button
              key={problem}
              type="button"
              style={optionStyle(problems.includes(problem))}
              onClick={() => {
                setProblems((prev) =>
                  prev.includes(problem)
                    ? prev.filter((p) => p !== problem)
                    : [...prev, problem]
                );
                setShowProblemError(false);
              }}
            >
              {problem}
            </button>
          ))}

          {showProblemError && (
            <div style={{ color: "#2f855a", marginTop: 8 }}>
              Оберіть хоча б одну проблему
            </div>
          )}

          <button
            style={primaryButtonStyle(problems.length === 0)}
            disabled={problems.length === 0}
            onClick={() => {
              if (problems.length === 0) {
                setShowProblemError(true);
                return;
              }
              setStep(3);
            }}
          >
            Продовжити
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h2>Питання 3 з 6</h2>
          <p>Скільки вам років?</p>
          {["30–35", "36–40", "41–45", "46–50", "51+"].map((range) => (
            <button
              key={range}
              type="button"
              style={optionStyle(ageRange === range)}
              onClick={() => setAgeRange(range)}
            >
              {range}
            </button>
          ))}
          <button
            style={primaryButtonStyle(!ageRange)}
            disabled={!ageRange}
            onClick={() => setStep(4)}
          >
            Продовжити
          </button>
        </>
      )}

      {step === 4 && (
        <>
          <h2>Питання 4 з 6</h2>
          <p>Чи є у вас чутливість шкіри?</p>
          {[
            "Чутлива",
            "Схильна до почервонінь",
            "Є алергічні реакції",
            "Без особливостей",
          ].map((item) => (
            <button
              key={item}
              type="button"
              style={optionStyle(sensitivity === item)}
              onClick={() => setSensitivity(item)}
            >
              {item}
            </button>
          ))}
          <button
            style={primaryButtonStyle(!sensitivity)}
            disabled={!sensitivity}
            onClick={() => setStep(5)}
          >
            Продовжити
          </button>
        </>
      )}

      {step === 5 && (
        <>
          <h2>Питання 5 з 6</h2>
          <p>Формат догляду</p>
          {[
            { id: "min", label: "Мінімальний" },
            { id: "optimal", label: "Оптимальний" },
            { id: "max", label: "Розширений" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              style={optionStyle(offerType === opt.id)}
              onClick={() => setOfferType(opt.id)}
            >
              {opt.label}
            </button>
          ))}
          <button
            style={primaryButtonStyle(!offerType)}
            disabled={!offerType}
            onClick={() => setStep(6)}
          >
            Отримати результат
          </button>
        </>
      )}

      {step === 6 && (
        <>
          <h2>Результат діагностики</h2>
          <p>Дякуємо! Ми підготували персональні рекомендації саме для вас.</p>
          <button
            type="button"
            style={primaryButtonStyle(false)}
            onClick={() => setStep(7)}
          >
            Отримати персональні рекомендації
          </button>
        </>
      )}

    {/* ===== STEP 7 ===== */}
{step === 7 && (() => {
  const phoneValue = phone.trim();
  const emailValue = email.trim();

  // Допустимые форматы телефонов:
  // +380XXXXXXXXX  (13 символов вместе с "+")
  // 380XXXXXXXXX   (12 цифр)
  // 0XXXXXXXXX     (10 цифр)
  // XXXXXXXXX     (9 цифр)
  const isPhoneValid =
    /^\+380\d{9}$/.test(phoneValue) ||
    /^380\d{9}$/.test(phoneValue) ||
    /^0\d{9}$/.test(phoneValue);

  // Проверка e-mail
  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

  // Имя обязательно
  const isNameValid = name.trim().length > 0;

  // Общая валидность формы
  const isFormValid =
    isNameValid &&
    isPhoneValid &&
    isEmailValid;

  return (
    <>
      <h2>Контактні дані</h2>

      {/* ===== ІМ'Я ===== */}
      <input
        type="text"
        placeholder="Імʼя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: 14,
          marginBottom: 12,
          border: "1px solid #cfcfcf",
          fontSize: 16,
        }}
      />

      {/* ===== ТЕЛЕФОН ===== */}
      <input
        type="tel"
        placeholder="Телефон"
        value={phone}
        onChange={(e) => {
          const value = e.target.value.trim();
          setPhone(e.target.value);

          const valid =
            /^\+380\d{9}$/.test(value) ||
            /^380\d{9}$/.test(value) ||
            /^0\d{9}$/.test(value);

          if (value === "") {
            setPhoneError("");
          } else if (valid) {
            setPhoneError("");
          } else {
            setPhoneError("Введіть коректний номер телефону України");
          }
        }}
        style={{
          width: "100%",
          padding: 14,
          marginBottom: 4,
          border: "1px solid #cfcfcf",
          fontSize: 16,
        }}
      />

      {phoneError && (
        <div
          style={{
            color: "#2f855a",
            fontSize: 14,
            marginBottom: 12,
          }}
        >
          {phoneError}
        </div>
      )}

      {/* ===== EMAIL ===== */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          const value = e.target.value.trim();
          setEmail(e.target.value);

          const valid =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

          if (value === "") {
            setEmailError("");
          } else if (valid) {
            setEmailError("");
          } else {
            setEmailError("Введіть коректний e-mail");
          }
        }}
        style={{
          width: "100%",
          padding: 14,
          marginBottom: 4,
          border: "1px solid #cfcfcf",
          fontSize: 16,
        }}
      />

      {emailError && (
        <div
          style={{
            color: "#2f855a",
            fontSize: 14,
            marginBottom: 12,
          }}
        >
          {emailError}
        </div>
      )}

      {/* ===== КНОПКА ===== */}
      <button
        type="button"
        disabled={!isFormValid}
        style={primaryButtonStyle(!isFormValid)}
        onClick={() => {
          if (!isFormValid) return;
          setStep(8);
        }}
      >
        Отримати персональні рекомендації
      </button>
    </>
  );
})()}

     {step === 8 && (
  <>
    <h2>Ваші персональні набори догляду</h2>

    <p>
      На основі діагностики ми підібрали оптимальні варіанти догляду саме для вас. 💚
    </p>

    <div
      style={{
        marginTop: 24,
        display: "grid",
        gap: 20,
      }}
    >
      {/* Мінімальний набір */}
      <div
        style={{
          padding: 20,
          border: "1px solid #cfcfcf",
          borderRadius: 12,
          background: "#ffffff",
        }}
      >
        <h3>Мінімальний набір</h3>
        <p>Базовий догляд для щоденного використання.</p>
      </div>

      {/* Оптимальний набір */}
      <div
        style={{
          padding: 20,
          border: "3px solid #2f855a",
          borderRadius: 12,
          background: "#f0fff4",
        }}
      >
        <h3>Оптимальний набір ⭐</h3>
        <p>
          Найкращий баланс ефективності та вартості для видимого результату.
        </p>
      </div>

      {/* Розширений догляд */}
      <div
        style={{
          padding: 20,
          border: "1px solid #cfcfcf",
          borderRadius: 12,
          background: "#ffffff",
        }}
      >
        <h3>Розширений догляд</h3>
        <p>Максимальний anti-age та інтенсивний догляд.</p>
      </div>
    </div>
  </>
)}
    </main>
  );
}
