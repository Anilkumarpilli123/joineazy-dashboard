import React from "react";

export default function Sidebar({ onNavigate, active }) {
  return (
    <aside className="w-64 hidden md:block bg-white border-r p-4">
      <nav className="flex flex-col gap-2">
        <button onClick={() => onNavigate("dashboard")} className={`text-left p-2 rounded ${active === "dashboard" ? "bg-blue-50" : ""}`}>Dashboard</button>
        <button onClick={() => onNavigate("assignments")} className={`text-left p-2 rounded ${active === "assignments" ? "bg-blue-50" : ""}`}>Assignments</button>
        <button onClick={() => onNavigate("profile")} className={`text-left p-2 rounded ${active === "profile" ? "bg-blue-50" : ""}`}>Profile</button>
      </nav>
    </aside>
  );
}
