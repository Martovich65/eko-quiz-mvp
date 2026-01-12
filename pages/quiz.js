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

  // ====== СТИЛИ ======

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

  // ====== RENDER ======

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Онлайн-діагностика шкіри</h1>

      {/* ===== ШАГ 1 ===== */}
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

      {/* ===== ШАГ 2 ===== */}
      {step === 2 && (
        <>
          <h2>Питання 2 з 6</h2>
          <p><strong>Які проблеми шкіри вас турбують зараз?</strong></p>

          <p style={{ color: "#2f855a" }}>
            Найчастіше проблем буває декілька — оберіть усі, що актуальні для вас.
          </p>

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
            <div style={{ color: "#2f855a", fontWeight: 700, marginTop: 12 }}>
              Будь ласка, оберіть хоча б одну проблему
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

      {/* ===== ШАГ 3 ===== */}
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

      {/* ===== ШАГ 4 ===== */}
      {step === 4 && (
        <>
          <h2>Питання 4 з 6</h2>
          <p>Чи є у вас особливості або чутливість шкіри?</p>

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

      {/* ===== ШАГ 5 ===== */}
      {step === 5 && (
        <>
          <h2>Питання 5 з 6</h2>
          <p>Який варіант догляду вам більше підходить?</p>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              { id: "min", label: "Мінімальне рішення" },
              { id: "optimal", label: "Оптимальний набір" },
              { id: "max", label: "Розширений догляд" },
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

    <div
      style={{
        marginTop: 20,
        padding: "20px",
        background: "#f0fff4",
        border: "1px solid #2f855a",
        borderRadius: "12px",
        color: "#1f2937",
        lineHeight: 1.6,
      }}
    >
      <p><strong>Тип шкіри:</strong> {skinType}</p>

      <p>
        <strong>Основні проблеми:</strong>{" "}
        {problems.length > 0 ? problems.join(", ") : "—"}
      </p>

      <p><strong>Вік:</strong> {ageRange}</p>

      <p><strong>Чутливість:</strong> {sensitivity}</p>

      <p>
        <strong>Формат догляду:</strong>{" "}
        {offerType === "min" && "Мінімальне рішення"}
        {offerType === "optimal" && "Оптимальний набір"}
        {offerType === "max" && "Розширений догляд"}
      </p>
    </div>

    {/* ЕДИНСТВЕННАЯ КНОПКА */}
    <button
      type="button"
      onClick={() => setStep(7)}
      style={{
        marginTop: 28,
        width: "100%",
        padding: "16px",
        backgroundColor: "#2f855a",
        color: "#ffffff",
        fontSize: "17px",
        fontWeight: 600,
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
      }}
    >
      Отримати персональні рекомендації
    </button>
  </>
)}

{step === 7 && (
  <>
    <h2>Ваші персональні рекомендації готові</h2>

    <p>
      Заповніть контактні дані — після цього ви побачите
      <strong> персональні набори догляду</strong>.
      <br />
      Якщо бажаєте онлайн-консультацію — напишіть про це в коментарі.
    </p>

    <div
      style={{
        marginTop: 20,
        padding: "20px",
        border: "1px solid #cfcfcf",
        borderRadius: "12px",
        background: "#ffffff",
      }}
    >
      {/* ІМʼЯ */}
      <input
        type="text"
        placeholder="Імʼя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          marginBottom: 12,
          borderRadius: "8px",
          border: "1px solid #cfcfcf",
          fontSize: "15px",
        }}
      />

      {/* ТЕЛЕФОН */}
      <input
        type="tel"
        placeholder="Телефон (Україна)"
        value={phone}
        onChange={(e) => {
          const value = e.target.value;
          setPhone(value);

          const clean = value.replace(/\s+/g, "");
          const phoneRegex =
            /^(\\+380|0)(39|50|63|66|67|68|73|91|92|93|94|95|96|97|98|99)\\d{7}$/;

          if (phoneRegex.test(clean)) {
            setPhoneError("");
          }
        }}
        style={{
          width: "100%",
          padding: "14px",
          marginBottom: 6,
          borderRadius: "8px",
          border: "1px solid #cfcfcf",
          fontSize: "15px",
        }}
      />

      {phoneError && (
        <div style={{ color: "#2f855a", fontSize: 14, marginBottom: 10 }}>
          {phoneError}
        </div>
      )}

      {/* EMAIL */}
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => {
          const value = e.target.value;
          setEmail(value);

          const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
          if (emailRegex.test(value)) {
            setEmailError("");
          }
        }}
        style={{
          width: "100%",
          padding: "14px",
          marginBottom: 6,
          borderRadius: "8px",
          border: "1px solid #cfcfcf",
          fontSize: "15px",
        }}
      />

      {emailError && (
        <div style={{ color: "#2f855a", fontSize: 14, marginBottom: 10 }}>
          {emailError}
        </div>
      )}

      {/* КОМЕНТАР */}
      <textarea
        placeholder="Коментар (якщо бажаєте консультацію — напишіть тут)"
        rows={4}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "8px",
          border: "1px solid #cfcfcf",
          fontSize: "15px",
          marginTop: 6,
        }}
      />
    </div>

    {/* КНОПКА */}
    <button
      type="button"
      onClick={() => {
        let hasError = false;

        const phoneClean = phone.replace(/\s+/g, "");
        const phoneRegex =
          /^(\\+380|0)(39|50|63|66|67|68|73|91|92|93|94|95|96|97|98|99)\\d{7}$/;
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

        if (!phoneRegex.test(phoneClean)) {
          setPhoneError("Введіть коректний номер телефону України");
          hasError = true;
        }

        if (!emailRegex.test(email)) {
          setEmailError("Введіть коректний e-mail");
          hasError = true;
        }

        if (hasError) return;

        setStep(8);
      }}
      style={{
        marginTop: 24,
        width: "100%",
        padding: "16px",
        backgroundColor: "#2f855a",
        color: "#ffffff",
        fontSize: "17px",
        fontWeight: 600,
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
      }}
    >
      Отримати ваші персональні рекомендації
    </button>
  </>
)}


    </main>
  );
}
