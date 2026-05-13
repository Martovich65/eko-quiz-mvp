import { useState, useRef } from 'react';
        <div>
          <h2>Крок 8 із 9</h2>
          <h3>Введіть ваш E-mail</h3>

          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="example@email.com"
            style={inputStyle}
          />

          <br />

          <button
            onClick={saveEmail}
            disabled={!isEmailValid}
          >
            Далі
          </button>
        </div>
      )}

      {/* Крок 9 */}
      {step === 10 && (
        <div>
          <h2>Крок 9 із 9</h2>
          <h3>Введіть номер телефону</h3>

          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="+380XXXXXXXXX"
            style={inputStyle}
          />

          <br />

          <button
            onClick={savePhone}
            disabled={!phoneInput.trim()}
          >
            Завершити тест
          </button>
        </div>
      )}

      {/* Финальный экран */}
      {step === 11 && (
        <div>
          <h2>Анкету успішно заповнено ✅</h2>

          <p><strong>Тип шкіри:</strong> {answers.skinType}</p>
          <p><strong>Головна проблема:</strong> {answers.mainProblem}</p>
          <p><strong>Реакція на воду:</strong> {answers.waterReaction}</p>
          <p><strong>Бажаний результат:</strong> {answers.desiredResult}</p>
          <p><strong>Вік:</strong> {answers.age}</p>
          <p><strong>Алергії:</strong> {answers.hasAllergies}</p>
          <p><strong>Ім'я:</strong> {answers.name}</p>
          <p><strong>E-mail:</strong> {answers.email}</p>
          <p><strong>Телефон:</strong> {answers.phone}</p>

          <p>🎉 Усі 9 кроків завершено.</p>
        </div>
      )}
    </div>
  );
}
