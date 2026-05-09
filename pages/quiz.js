import { useState } from "react";
                <li>Активні комплекси</li>
                <li>Догляд за зоною очей</li>
                <li>Інтенсивні маски</li>
              </ul>

              <button
                style={{
                  marginTop: 12,
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#2f855a",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => window.open("/shop/max", "_blank")}>
                Переглянути набір
              </button>
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <button
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#1f2937",
                color: "#ffffff",
                border: "none",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => window.open("/shop", "_blank")}>
              Подивитись магазин
            </button>
          </div>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <p>
              Хочете онлайн-консультацію?
              <br />
              Напишіть про це в коментарі — ми з вами зв’яжемося 💬
            </p>
          </div>
        </>
      )}
    </main>
  );
}
