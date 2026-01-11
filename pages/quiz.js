import { useState } from "react";

export default function Quiz() {
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState(null);
  const [problems, setProblems] = useState([]);
const [offerType, setOfferType] = useState(null);
  const [ageRange, setAgeRange] = useState(null);
  const [showAgeError, setShowAgeError] = useState(false);
  const [sensitivity, setSensitivity] = useState(null);
  const [showSensitivityError, setShowSensitivityError] = useState(false);
const [showProblemError, setShowProblemError] = useState(false);
const optionStyle = (isActive, width = "100%") => ({
  appearance: "none",
  WebkitAppearance: "none",

  backgroundColor: isActive ? "#2f855a" : "#f4f4f4",
  color: isActive ? "#ffffff" : "#111827",

  border: isActive ? "2px solid #2f855a" : "1px solid #d1d5db",

  padding: "14px 16px",
  margin: "10px 0",

  display: "block",
  width: width,

  textAlign: "left",
  cursor: "pointer",

  fontSize: "16px",
  fontWeight: 500,
  lineHeight: "1.4",

  borderRadius: "10px",
  boxSizing: "border-box",

  transition: "all 0.2s ease",
});

  return (

    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Онлайн-діагностика шкіри</h1>

{step === 1 && (
  <>
    <h2>Питання 1 з 6</h2>
    <p>Який у вас тип шкіри?</p>

    <ul style={{ listStyle: "none", padding: 0 }}>
      {[
        "Суха",
        "Нормальна",
        "Комбінована",
        "Жирна",
        "Важко сказати",
      ].map((type) => (
        <li key={type}>
  <button
  onClick={() => {
    if (!skinType) return;
    setStep(2);
  }}
  style={{
    marginTop: 20,
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
  Продовжити
</button>

  </>
)}

{step === 2 && (
  <>
    <h2>Питання 2 з 6</h2>
    <p><strong>Які проблеми шкіри вас турбують зараз?</strong></p>

<p>
  <span style={{ color: "#2f855a" }}>
    Найчастіше проблем буває декілька — оберіть усі, що актуальні для вас.
  </span>
</p>

    <p>
      <strong>Обраний тип шкіри:</strong> {skinType}
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
    "Втрата пружності шкіри в зоні шиї"
  ].map((problem) => (
    <li key={problem} style={{ marginBottom: 8 }}>
      <button
        onClick={() => {
          setProblems((prev) =>
            prev.includes(problem)
              ? prev.filter((p) => p !== problem)
              : [...prev, problem]
          );
    setShowProblemError(false);
        }}
style={{
  background: problems.includes(problem) ? "#2f855a" : "#f4f4f4",
  color: problems.includes(problem) ? "#ffffff" : "#111827",
  border: "1px solid #cfcfcf",
  padding: "10px 12px",
  margin: "6px 0",
  display: "block",
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "15px",
  lineHeight: "1.4",
  borderRadius: 0,
  outline: "none",
}}
onFocus={(e) =>
  (e.currentTarget.style.boxShadow =
    "0 0 0 3px rgba(47,133,90,0.12)")
}
onBlur={(e) =>
  (e.currentTarget.style.boxShadow = "none")
}

      >
        {problem}
      </button>
    </li>
  ))}
</ul>
{problems.length > 0 && (
  <div
    style={{
      marginTop: 16,
      padding: "12px 14px",
      background: "#f0fff4",
      border: "1px solid #2f855a",
      borderRadius: 6,
      color: "#2f855a",
      fontSize: 15,
      lineHeight: 1.4
    }}
  >
    <strong>Ви обрали:</strong> {problems.join(", ")}
  </div>
)}

{showProblemError && (
  <div
    style={{
      border: "2px solid #2f855a",
      background: "#f0fff4",
      padding: "14px",
      margin: "14px 0",
      borderRadius: "8px",
      fontSize: "20px",
      fontWeight: 700,
      color: "#2f855a",
      textAlign: "center"
    }}
  >
    Будь ласка, оберіть хоча б одну проблему яка зараз актуальна для Вас!
  </div>
)}

<button
  onClick={() => {
    if (!skinType) return;
    setStep(2);
  }}
  style={{
    marginTop: 20,
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
  Продовжити
</button>


  </>
)}
{step === 3 && (
  <>
    <h2>Питання 3 з 6</h2>
    <p>Скільки вам років?</p>

    <ul style={{ listStyle: "none", padding: 0 }}>
      {[
        "30–35",
        "36–40",
        "41–45",
        "46–50",
        "51+",
      ].map((range) => (
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
      onClick={() => {
        if (!ageRange) return;
        setStep(4);
      }}
    >
      Продовжити
    </button>
  </>
)}

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
      onClick={() => {
        if (!sensitivity) return;
        setStep(5);
      }}
    >
      Продовжити
    </button>
  </>
)}

{step === 5 && (
  <>
    <h2>Питання 6 з 6</h2>
    <p>Який варіант догляду вам більше підходить?</p>

    <ul style={{ listStyle: "none", padding: 0 }}>
      {[
        {
          value: "min",
          label: "Мінімальне рішення (окремі засоби)",
        },
        {
          value: "optimal",
          label: "Оптимальний набір (рекомендовано)",
        },
        {
          value: "max",
          label: "Розширений догляд (максимальний ефект)",
        },
      ].map((item) => (
        <li key={item.value}>
          <button
            type="button"
            style={optionStyle(offerType === item.value)}
            onClick={() => setOfferType(item.value)}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>

    <button
      onClick={() => {
        if (!offerType) return;
        setStep(6);
      }}
    >
      Продовжити
    </button>
  </>
)}
 
    </main>
  );
}



      
