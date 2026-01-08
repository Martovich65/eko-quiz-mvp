export default function Home() {
  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Онлайн-діагностика шкіри</h1>

      <p>
        Віртуальний косметолог допоможе підібрати догляд,
        який підходить саме вам.
      </p>

      <a href="/quiz">
        <button
          style={{
            padding: "14px 24px",
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          Почати сеанс
        </button>
      </a>
    </main>
  );
}

