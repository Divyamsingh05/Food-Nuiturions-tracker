import { NavLink } from "react-router-dom";
import { LayoutDashboard, Search, Camera, BookOpen, BarChart2, Settings } from "lucide-react";

const navItems = [
  { to: "/",       icon: LayoutDashboard, label: "Home" },
  { to: "/search", icon: Search,          label: "Search" },
  { to: "/scan",   icon: Camera,          label: "Scan" },
  { to: "/journal",icon: BookOpen,         label: "Journal" },
  { to: "/history",icon: BarChart2,        label: "History" },
];

export default function Navbar() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <a className="navbar-logo" href="/">
            <div className="logo-icon">🥗</div>
            <span className="logo-text">NutriTrack</span>
          </a>
          <span className="navbar-date">{today}</span>
        </div>
      </header>

      <nav className="bottom-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          >
            <div className="nav-icon-wrap">
              <Icon size={18} />
            </div>
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
