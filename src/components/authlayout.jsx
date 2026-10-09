import "../assets/css/auth.css";

const features = [
  "Track income and expenses in one place",
  "See where your money goes with charts",
  "Search, filter and manage every transaction",
];

function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <div className="auth-brand">PERSONAL FINANCE</div>

        <div className="auth-pitch">
          <h1>Take control of your money.</h1>
          <ul>
            {features.map((text) => (
              <li key={text}>
                <span className="check" aria-hidden="true">✓</span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <small className="auth-foot">Simple. Private. Yours.</small>
      </aside>

      <main className="auth-main">
        <div className="auth-brand-mobile">PERSONAL FINANCE</div>
        <div className="auth-card">{children}</div>
      </main>
    </div>
  );
}

export default AuthLayout;