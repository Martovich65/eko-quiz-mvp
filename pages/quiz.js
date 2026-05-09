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

  const phoneRegex =
    /^(?:\+380|0)(39|50|63|66|67|68|73|91|92|93|94|95|96|97|98|99)\d{7}$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  return (
    <main
      style={{
        maxWidth: 600,
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Онлайн-діагностика шкіри</h1>

      {/* ===== STEP 1 ===== */}
      {step === 1 && (
        <>
          <p>Який у вас тип шкіри?</p>
          {["Суха", "Нормальна", "Комбінована", "Жирна", "Важко сказати"].map(
            (type) => (
              <button
                key={type}
                type="button"
                style={optionStyle(skinType === type)}
                onClick={() => setSkinType(type)}
              >
                {type}
              </button>
            )
          )}

          <button
            type="button"
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
          <p>Які проблеми шкіри вас турбують?</p>

          {["Сухість", "Зморшки", "Пігментація", "Акне"].map((problem) => (
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
              }}
            >
              {problem}
            </button>
          ))}

          <button
            type="button"
            style={primaryButtonStyle(problems.length === 0)}
            disabled={problems.length === 0}
            onClick={() => setStep(3)}
          >
            Продовжити
          </button>
        </>
      )}

      {/* ===== STEP 3 ===== */}
      {step === 3 && (
        <>
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
            type="button"
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
          <p>Чи є у вас чутливість шкіри?</p>

          {["Чутлива", "Без особливостей"].map((item) => (
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
            type="button"
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
            type="button"
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
          <p>Ми підготували персональні рекомендації.</p>

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
      {step === 7 && (
        (() => {
          const isPhoneValid = phoneRegex.test(phone.trim());
          const isEmailValid = emailRegex.test(email.trim());
          const isFormValid = isPhoneValid && isEmailValid;

          return (
            <>
              <h2>Контактні дані</h2>

              <input
                placeholder="Імʼя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: 14,
                  marginBottom: 12,
                }}
              />

              <input
                placeholder="Телефон"
                value={phone}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  setPhone(v);

                  if (v === "") {
                    setPhoneError("");
                  } else if (phoneRegex.test(v)) {
                    setPhoneError("");
                  } else {
                    setPhoneError(
                      "Введіть коректний номер телефону України"
                    );
                  }
                }}
                style={{
                  width: "100%",
                  padding: 14,
                  marginBottom: 4,
                }}
              />

              {phoneError && (
                <div
                  style={{
                    color: "#2f855a",
                    marginBottom: 12,
                    fontSize: 14,
                  }}
                >
                  {phoneError}
                </div>
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  setEmail(v);

                  if (v === "") {
                    setEmailError("");
                  } else if (emailRegex.test(v)) {
                    setEmailError("");
                  } else {
                    setEmailError("Введіть коректний e-mail");
                  }
                }}
                style={{
                  width: "100%",
                  padding: 14,
                  marginBottom: 4,
                }}
              />

              {emailError && (
                <div
                  style={{
                    color: "#2f855a",
                    marginBottom: 12,
                    fontSize: 14,
                  }}
                >
                  {emailError}
                </div>
              )}

              <button
                type="button"
                disabled={!isFormValid}
                style={primaryButtonStyle(!isFormValid)}
                onClick={() => {
                  if (isFormValid) {
                    setStep(8);
                  }
                }}
              >
                Отримати персональні рекомендації
              </button>
            </>
          );
        })()
      )}

      {/* ===== STEP 8 ===== */}
      {step === 8 && (
        <>
          <h2>Ваші персональні набори догляду</h2>
          <p>Форма працює правильно. Валідація завершена успішно. 🎉</p>
        </>
      )}
    </main>
  );
}
