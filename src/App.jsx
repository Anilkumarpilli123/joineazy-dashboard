import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UserProvider, UserContext } from "./context/UserContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from "./pages/AuthPage";
import { users as seededUsers } from "./data/mockData"; // ✅ only users kept, no assignments

function AppInner() {
  const { currentUser } = useContext(UserContext);

  // 🧠 Start with an empty assignment list
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("joineazy_assignments");
    return saved ? JSON.parse(saved) : []; // 👈 empty by default
  });

  const [active, setActive] = useState("dashboard");

  // 💾 Save assignments whenever they change
  useEffect(() => {
    localStorage.setItem("joineazy_assignments", JSON.stringify(assignments));
  }, [assignments]);

  // ✅ Remove mockData init logic completely

  if (!currentUser) return <Navigate to="/auth" replace />;

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar onNavigate={(p) => setActive(p)} active={active} />
        <main className="flex-1 p-4 max-w-5xl mx-auto">
          <div className="bg-gray-50 p-4 rounded">
            {currentUser.role === "admin" ? (
              <AdminDashboard assignments={assignments} setAssignments={setAssignments} />
            ) : (
              <StudentDashboard assignments={assignments} setAssignments={setAssignments} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/*" element={<AppInner />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          pauseOnHover
          theme="colored"
        />
      </Router>
    </UserProvider>
  );
}
