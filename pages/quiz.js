export default function Quiz() {
  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Онлайн-діагностика шкіри</h1>

      <h2>Питання 1 з 6</h2>
      <p>Який у вас тип шкіри?</p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><button>Суха</button></li>
        <li><button>Нормальна</button></li>
        <li><button>Комбінована</button></li>
        <li><button>Жирна</button></li>
        <li><button>Важко сказати</button></li>
      </ul>
    </main>
  );
}
