// ВСТАВЬТЕ В ВАШ ФАЙЛ pages/quiz.js СЛЕДУЮЩИЕ ИЗМЕНЕНИЯ

// 1. Добавьте новую функцию рядом с selectAge:

const selectAllergies = (value) => {
  saveAnswer('hasAllergies', value);
  setStep(8);
};

// 2. Замените блок "Временный экран проверки"
// (тот, где сейчас step === 7)
// на следующий блок:

{step === 7 && (
  <div>
    <h2>Крок 6 із 9</h2>
    <h3>Чи є у вас алергії?</h3>

    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '320px',
        margin: '20px auto',
      }}
    >
      <button onClick={() => selectAllergies('Так')}>
        Так
      </button>

      <button onClick={() => selectAllergies('Ні')}>
        Ні
      </button>
    </div>
  </div>
)}

// 3. Добавьте новый экран проверки СРАЗУ ПОСЛЕ него:

{step === 8 && (
  <div>
    <h2>Відповіді збережено ✅</h2>

    <p><strong>Тип шкіри:</strong> {answers.skinType}</p>
    <p><strong>Головна проблема:</strong> {answers.mainProblem}</p>
    <p><strong>Реакція на воду:</strong> {answers.waterReaction}</p>
    <p><strong>Бажаний результат:</strong> {answers.desiredResult}</p>
    <p><strong>Вік:</strong> {answers.age}</p>
    <p><strong>Алергії:</strong> {answers.hasAllergies}</p>

    <p>Далі буде Крок 7 із 9.</p>
  </div>
)}
