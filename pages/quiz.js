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
    <p>Скільки вам років?</p>

    <ul style={{ listStyle: "none", padding: 0 }}>
      <li>
        <button onClick={() => setStep(4)}>30–35</button>
      </li>
      <li>
        <button onClick={() => setStep(4)}>36–40</button>
      </li>
      <li>
        <button onClick={() => setStep(4)}>41–45</button>
      </li>
      <li>
        <button onClick={() => setStep(4)}>46–50</button>
      </li>
      <li>
        <button onClick={() => setStep(4)}>51+</button>
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
        <button onClick={() => setStep(5)}>Чутлива</button>
      </li>
      <li>
        <button onClick={() => setStep(5)}>Схильна до почервонінь</button>
      </li>
      <li>
        <button onClick={() => setStep(5)}>Є алергічні реакції</button>
      </li>
      <li>
        <button onClick={() => setStep(5)}>Без особливостей</button>
      </li>
    </ul>
  </>
)}
{step === 5 && (
  <>
    <h2>Питання 6 з 6</h2>
    <p>Який варіант догляду вам більше підходить?</p>

    <ul style={{ listStyle: "none", padding: 0 }}>
      <li>
        <button onClick={() => setStep(6)}>
          🔹 Мінімальне рішення (окремі засоби)
        </button>
      </li>

      <li>
        <button onClick={() => setStep(6)}>
          ⭐ Оптимальний набір (рекомендовано)
        </button>
      </li>

      <li>
        <button onClick={() => setStep(6)}>
          💎 Розширений догляд (максимальний ефект)
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


