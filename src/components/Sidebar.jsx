import React, { useContext } from "react";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";

export default function Sidebar({ onNavigate, active }) {
  const { currentUser } = useContext(UserContext);

  if (!currentUser) return null;

  
  const adminMenu = [
    { id: "dashboard", label: "Dashboard" },
    { id: "assignments", label: "Assignments" },
    { id: "analytics", label: "Analytics" },
  ];

  const studentMenu = [
    { id: "dashboard", label: "Dashboard" },
    { id: "submissions", label: "My Submissions" },
  ];

  const menu = currentUser.role === "admin" ? adminMenu : studentMenu;

  return (
    <aside className="hidden md:flex flex-col w-56 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-blue-700">
          {currentUser.role === "admin" ? "Professor" : "Student"} Panel
        </h2>
        <p className="text-xs text-gray-500 mt-1">{currentUser.name}</p>
      </div>

      <nav className="flex-1 mt-4">
        {menu.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            whileHover={{ scale: 1.03 }}
            className={`w-full text-left px-5 py-2.5 my-1 rounded-md transition-all duration-200 text-sm font-medium ${
              active === item.id
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
            }`}
          >
            {item.label}
          </motion.button>
        ))}
      </nav>

      <div className="border-t p-4 text-xs text-gray-500">
        © 2025 Joineazy Internship
      </div>
    </aside>
  );
}
