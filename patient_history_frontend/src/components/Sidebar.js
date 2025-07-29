import React from "react";
import { NavLink } from "react-router-dom";

// PUBLIC_INTERFACE
function Sidebar() {
  /** Sidebar navigation for the main app */
  return (
    <aside className="sidebar">
      <div className="sidebar-header">Patient History</div>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/" end className="sidebar-link">
            Patients
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
