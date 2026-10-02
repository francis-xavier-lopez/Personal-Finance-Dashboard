import "../assets/css/sidebar.css";

const items = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "transactions", label: "Transactions", icon: "💳" },
  { id: "charts", label: "Charts", icon: "📊" },
];

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-brand">
        <span className="brand-icon" aria-hidden="true">💰</span>
        <span className="brand-text">Personal Finance</span>
      </h2>

      <nav>
        <span className="sidebar-title">Navigation</span>

        {items.map((item) => (
          <button
            key={item.id}
            className={activePage === item.id ? "active" : ""}
            onClick={() => setActivePage(item.id)}
            aria-current={activePage === item.id ? "page" : undefined}
            title={item.label}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;