import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../theme/ThemeProvider";

// PUBLIC_INTERFACE
function Topbar() {
  /** Top navigation bar showing user info, logout, theme toggle */
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getUserInitials = () => {
    if (!user) return "?";
    return user.name?.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <header className="topbar">
      <span style={{ fontWeight: 700, fontSize: 20, color: "var(--primary)" }}>
        🏥 CareConnect
      </span>
      <div className="topbar-user">
        <div className="topbar-user-avatar">{getUserInitials()}</div>
        <div className="topbar-user-info">
          <span>{user?.name || "No name"}</span>
          <span style={{ fontSize: "0.94em", color: "var(--text-muted)" }}>{user?.email || ""}</span>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <button className="topbar-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;
