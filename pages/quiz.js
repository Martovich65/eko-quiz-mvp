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

  const phoneRegex =
  /^(?:\+380|0)(39|50|63|66|67|68|73|91|92|93|94|95|96|97|98|99)\d{7}$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isPhoneValid = phoneRegex.test(phone.trim());
  const isEmailValid = emailRegex.test(email.trim());
  const isFormValid =
    name.trim().length > 0 && isPhoneValid && isEmailValid;

  return (
    <main
      style={{
        maxWidth: 600,
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Онлайн-діагностика шкіри</h1>

      {step === 1 && (
        <>
          <h2>Питання 1 з 6</h2>
          <p>Який у вас тип шкіри?</p>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {["Суха", "Нормальна", "Комбінована", "Жирна", "Важко сказати"].map((type) => (
              <li key={type}>
                <button
                  type="button"
                  style={optionStyle(skinType === type)}
                  onClick={() => setSkinType(type)}
                >
                  {type}
                </button>
              </li>
            ))}
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

      {step === 6 && (
        <>
          <h2>Результат діагностики</h2>
          <p>
            Дякуємо! На основі ваших відповідей ми проаналізували стан вашої шкіри
            та підготували персональні рекомендації.
          </p>

          <button
            type="button"
            onClick={() => setStep(7)}
            style={primaryButtonStyle(false)}
          >
            Отримати персональні рекомендації
          </button>
        </>
      )}

      {step === 7 && (
        <>
          <h2>Контактні дані</h2>

          <input
            placeholder="Імʼя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 14, marginBottom: 12, boxSizing: "border-box" }}
          />

          <input
            placeholder="Телефон"
            value={phone}
            onChange={(e) => {
              const v = e.target.value;
              setPhone(v);

              if (v.trim() === "") {
                setPhoneError("");
              } else if (phoneRegex.test(v.trim())) {
                setPhoneError("");
              } else {
                setPhoneError("Введіть коректний номер телефону України");
              }
            }}
            style={{ width: "100%", padding: 14, marginBottom: 4, boxSizing: "border-box" }}
          />

          {phoneError && (
            <div style={{ color: "#2f855a", marginBottom: 12, fontSize: 14 }}>
              {phoneError}
            </div>
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => {
              const v = e.target.value;
              setEmail(v);

              if (v.trim() === "") {
                setEmailError("");
              } else if (emailRegex.test(v.trim())) {
                setEmailError("");
              } else {
                setEmailError("Введіть коректний e-mail");
              }
            }}
            style={{ width: "100%", padding: 14, marginBottom: 4, boxSizing: "border-box" }}
          />

          {emailError && (
            <div style={{ color: "#2f855a", marginBottom: 12, fontSize: 14 }}>
              {emailError}
            </div>
          )}

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
      )}

      {step === 8 && (
        <>
          <h2>Ваші персональні набори догляду</h2>

          <p>
            На основі діагностики ми підібрали оптимальні варіанти догляду саме
            для вас. Оберіть формат, який підходить найбільше 💚
          </p>

          <div style={{ marginTop: 24, display: "grid", gap: 20 }}>
            <div style={{ padding: 20, border: "1px solid #cfcfcf", borderRadius: 12 }}>
              <h3>Мінімальний набір</h3>
              <p>Базовий догляд для підтримки шкіри.</p>
            </div>

            <div
              style={{
                padding: 20,
                border: "2px solid #2f855a",
                borderRadius: 12,
                background: "#f0fff4",
              }}
            >
              <h3>Оптимальний набір ⭐</h3>
              <p>Рекомендований варіант для комплексного догляду.</p>
            </div>

            <div style={{ padding: 20, border: "1px solid #cfcfcf", borderRadius: 12 }}>
              <h3>Розширений догляд</h3>
              <p>Максимальний anti-age ефект.</p>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
