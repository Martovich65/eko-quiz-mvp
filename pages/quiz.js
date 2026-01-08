import { useState } from "react";

export default function Quiz() {
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState(null);

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
    <p>Яка проблема турбує вас найбільше?</p>

    <p>
      <strong>Обраний тип шкіри:</strong> {skinType}
    </p>

    <ul style={{ listStyle: "none", padding: 0 }}>
      <li>
        <button onClick={() => setStep(3)}>Сухість / стягнутість</button>
      </li>
      <li>
        <button onClick={() => setStep(3)}>Зморшки</button>
      </li>
      <li>
        <button onClick={() => setStep(3)}>Пігментація</button>
      </li>
      <li>
        <button onClick={() => setStep(3)}>Постакне</button>
      </li>
      <li>
        <button onClick={() => setStep(3)}>Чорні цятки / пори</button>
      </li>
    </ul>
  </>
)}
{step === 3 && (
  <>
    <h2>Питання 3 з 6</h2>
    <p>Наступний крок (поки заглушка)</p>
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


