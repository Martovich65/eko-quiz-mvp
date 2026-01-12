import { useState } from "react";

export default function Quiz() {
  const [step, setStep] = useState(1);

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

  /* ===== СТИЛИ ===== */

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

  /* ===== REGEX ===== */

  const phoneRegex =
    /^(?:\+380|0)(39|50|63|66|67|68|73|91|92|93|94|95|96|97|98|99)\d{7}$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Онлайн-діагностика шкіри</h1>

      {/* ===== STEP 1 ===== */}
      {step === 1 && (
        <>
          <h2>Питання 1 з 6</h2>
          <p>Який у вас тип шкіри?</p>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {["Суха", "Нормальна", "Комбінована", "Жирна", "Важко сказати"].map(
              (type) => (
                <li key={type}>
                  <button
                    type="button"
                    style={optionStyle(skinType === type)}
                    onClick={() => setSkinType(type)}
                  >
                    {type}
                  </button>
                </li>
              )
            )}
          </ul>

          <button
            style={primaryButtonStyle(!skinType)}
            disabled={!skinType}
            onClick={() => setStep(2)}
          >
            Продовжити
          </button>
        </>
      )}

      {/* ===== STEP 2 ===== */}
      {step === 2 && (
        <>
          <h2>Питання 2 з 6</h2>
          <p><strong>Які проблеми шкіри вас турбують зараз?</strong></p>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              "Сухість / стягнутість",
              "Зморшки",
              "Пігментація",
              "Постакне",
              "Чорні цятки / пори",
              "Акне / прищі",
              "Темні кола та мішки під очима",
              "Гусячі лапки (зона очей)",
              "Міліуми (білі точки під шкірою)",
              "Розацеа",
              "Втрата пружності шкіри в зоні шиї",
            ].map((problem) => (
              <li key={problem}>
                <button
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
              </li>
            ))}
          </ul>

          {showProblemError && (
            <div style={{ color: "#2f855a", fontWeight: 700 }}>
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

      {/* ===== STEP 3 ===== */}
      {step === 3 && (
        <>
          <h2>Питання 3 з 6</h2>
          <p>Скільки вам років?</p>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {["30–35", "36–40", "41–45", "46–50", "51+"].map((range) => (
              <li key={range}>
                <button
                  type="button"
                  style={optionStyle(ageRange === range)}
                  onClick={() => setAgeRange(range)}
                >
                  {range}
                </button>
              </li>
            ))}
          </ul>

          <button
            style={primaryButtonStyle(!ageRange)}
            disabled={!ageRange}
            onClick={() => setStep(4)}
          >
            Продовжити
          </button>
        </>
      )}

      {/* ===== STEP 4 ===== */}
      {step === 4 && (
        <>
          <h2>Питання 4 з 6</h2>
          <p>Чи є у вас чутливість шкіри?</p>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              "Чутлива",
              "Схильна до почервонінь",
              "Є алергічні реакції",
              "Без особливостей",
            ].map((item) => (
              <li key={item}>
                <button
                  type="button"
                  style={optionStyle(sensitivity === item)}
                  onClick={() => setSensitivity(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>

          <button
            style={primaryButtonStyle(!sensitivity)}
            disabled={!sensitivity}
            onClick={() => setStep(5)}
          >
            Продовжити
          </button>
        </>
      )}

      {/* ===== STEP 5 ===== */}
      {step === 5 && (
        <>
          <h2>Питання 5 з 6</h2>
          <p>Формат догляду</p>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              { id: "min", label: "Мінімальний" },
              { id: "optimal", label: "Оптимальний" },
              { id: "max", label: "Розширений" },
            ].map((opt) => (
              <li key={opt.id}>
                <button
                  type="button"
                  style={optionStyle(offerType === opt.id)}
                  onClick={() => setOfferType(opt.id)}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            style={primaryButtonStyle(!offerType)}
            disabled={!offerType}
            onClick={() => setStep(6)}
          >
            Отримати результат
          </button>
        </>
      )}

      {/* ===== STEP 6 ===== */}
      {step === 6 && (
        <>
          <h2>Результат діагностики</h2>
          <button
            style={primaryButtonStyle(false)}
            onClick={() => setStep(7)}
          >
            Отримати персональні рекомендації
          </button>
        </>
      )}

      {/* ===== STEP 7 ===== */}
      {step === 7 && (
        <>
          <h2>Контактні дані</h2>

          <input
            placeholder="Імʼя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 14, marginBottom: 12 }}
          />

          <input
            placeholder="Телефон"
            value={phone}
            onChange={(e) => {
              const v = e.target.value;
              setPhone(v);
              if (phoneRegex.test(v)) setPhoneError("");
            }}
            style={{ width: "100%", padding: 14 }}
          />
          {phoneError && <div style={{ color: "#2f855a" }}>{phoneError}</div>}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => {
              const v = e.target.value;
              setEmail(v);
              if (emailRegex.test(v)) setEmailError("");
            }}
            style={{ width: "100%", padding: 14 }}
          />
          {emailError && <div style={{ color: "#2f855a" }}>{emailError}</div>}

          <button
            style={primaryButtonStyle(false)}
            onClick={() => {
              let err = false;
              if (!phoneRegex.test(phone)) {
                setPhoneError("Введіть коректний номер телефону України");
                err = true;
              }
              if (!emailRegex.test(email)) {
                setEmailError("Введіть коректний e-mail");
                err = true;
              }
              if (!err) setStep(8);
            }}
          >
            Отримати персональні рекомендації
          </button>
        </>
      )}
    </main>
  );
}
