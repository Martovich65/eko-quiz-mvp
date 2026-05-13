// 1. Добавьте рядом с другими useState:
const [nameInput, setNameInput] = useState('');

// 2. Добавьте новую функцию рядом с selectAllergies:
const saveName = () => {
  if (!nameInput.trim()) return;

  saveAnswer('name', nameInput.trim());
  setStep(9);
};

// 3. Замените блок проверки {step === 8 && (...)} на следующий:

{step === 8 && (
  <div>
    <h2>Крок 7 із 9</h2>
    <h3>Введіть ваше ім'я</h3>

    <input
      type="text"
      value={nameInput}
      onChange={(e) => setNameInput(e.target.value)}
      placeholder="Ваше ім'я"
      style={{
        padding: '12px',
        width: '100%',
        maxWidth: '320px',
        marginBottom: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
      }}
    />

    <br />

    <button
      onClick={saveName}
      disabled={!nameInput.trim()}
    >
      Далі
    </button>
  </div>
)}

// 4. Добавьте новый экран проверки сразу после него:

{step === 9 && (
  <div>
    <h2>Відповіді збережено ✅</h2>

    <p><strong>Тип шкіри:</strong> {answers.skinType}</p>
    <p><strong>Головна проблема:</strong> {answers.mainProblem}</p>
    <p><strong>Реакція на воду:</strong> {answers.waterReaction}</p>
    <p><strong>Бажаний результат:</strong> {answers.desiredResult}</p>
    <p><strong>Вік:</strong> {answers.age}</p>
    <p><strong>Алергії:</strong> {answers.hasAllergies}</p>
    <p><strong>Ім'я:</strong> {answers.name}</p>

    <p>Далі буде Крок 8 із 9.</p>
  </div>
)}
