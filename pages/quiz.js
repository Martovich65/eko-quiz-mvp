import { useState } from "react";

export default function Quiz() {
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState(null);
  const [problems, setProblems] = useState([]);
const [offerType, setOfferType] = useState(null);
  const [ageRange, setAgeRange] = useState(null);
  const [sensitivity, setSensitivity] = useState(null);
  const [showProblemError, setShowProblemError] = useState(false);

  return (

    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Онлайн-діагностика шкіри</h1>

      {step === 1 && (
  <>
    <h2>Питання 1 з 6</h2>
    <p>Який у вас тип шкіри?</p>
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
    if (problems.length === 0) {
      setShowProblemError(true);
      return;
    }

    setShowProblemError(false);
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
      <li>
        <button
  onClick={() => {
    setAgeRange("30–35");
    setStep(4);
  }}
>
  30–35
</button>

      </li>
      <li><button
  onClick={() => {
    setAgeRange("36–40");
    setStep(4);
  }}
>
  36–40
</button>

      </li>
      <li>
       <button
  onClick={() => {
    setAgeRange("41–45");
    setStep(4);
  }}
>
  41–45
</button>

      </li>
      <li>
        <button
  onClick={() => {
    setAgeRange("46–50");
    setStep(4);
  }}
>
  46–50
</button>

      </li>
      <li>
  <button
  onClick={() => {
    setAgeRange("51+");
    setStep(4);
  }}
>
  51+
</button>

      </li>
    </ul>
  </>
)}
{step === 4 && (
  <>
    <h2>Питання 4 з 6</h2>
    <p>Чи є у вас особливості або чутливість шкіри?</p>

    <ul style={{ listStyle: "none", padding: 0 }}>
      <li>
       <button
  onClick={() => {
    setSensitivity("Чутлива");
    setStep(5);
  }}
>
  Чутлива
</button>

      </li>
      <li><button
  onClick={() => {
    setSensitivity("Схильна до почервонінь");
    setStep(5);
  }}
>
  Схильна до почервонінь
</button>

      </li>
      <li>
       <button
  onClick={() => {
    setSensitivity("Є алергічні реакції");
    setStep(5);
  }}
>
  Є алергічні реакції
</button>

      </li>
      <li>
        <button
  onClick={() => {
    setSensitivity("Без особливостей");
    setStep(5);
  }}
>
  Без особливостей
</button>

      </li>
    </ul>
  </>
)}{step === 5 && (
  <>
    <h2>Питання 6 з 6</h2>
    <p>Який варіант догляду вам більше підходить?</p>

    <ul style={{ listStyle: "none", padding: 0 }}>
      <li>
        <button
          onClick={() => {
            setOfferType("min");
            setStep(7);
          }}
        >
          Мінімальне рішення (окремі засоби)
        </button>
      </li>

      <li>
        <button
          onClick={() => {
            setOfferType("optimal");
            setStep(7);
          }}
        >
          Оптимальний набір (рекомендовано)
        </button>
      </li>

      <li>
        <button
          onClick={() => {
            setOfferType("max");
            setStep(7);
          }}
        >
          Розширений догляд (максимальний ефект)
        </button>
      </li>
    </ul>
  </>
)}


      {step === 1 && (
<ul style={{ listStyle: "none", padding: 0 }}>
  <li>
    <button onClick={() => {
      setSkinType("Суха");
      setStep(2);
    }}>
      Суха
    </button>
  </li>

  <li>
    <button onClick={() => {
      setSkinType("Нормальна");
      setStep(2);
    }}>
      Нормальна
    </button>
  </li>

  <li>
    <button onClick={() => {
      setSkinType("Комбінована");
      setStep(2);
    }}>
      Комбінована
    </button>
  </li>

  <li>
    <button onClick={() => {
      setSkinType("Жирна");
      setStep(2);
    }}>
      Жирна
    </button>
  </li>

  <li>
    <button onClick={() => {
      setSkinType("Важко сказати");
      setStep(2);
    }}>
      Важко сказати
    </button>
  </li>
</ul>)}
    </main>
  );
}


