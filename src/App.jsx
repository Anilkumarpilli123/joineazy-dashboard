// src/App.jsx
import React, { useState, useEffect } from "react";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { initialAssignments, users as seededUsers } from "./data/mockData";

function AppInner() {
  // assignments persisted in localStorage
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("joineazy_assignments");
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    localStorage.setItem("joineazy_assignments", JSON.stringify(assignments));
  }, [assignments]);

  function handleSubmitToggle(assignmentId, studentId) {
    setAssignments(prev =>
      prev.map(a =>
        a.id === assignmentId
          ? { ...a, submissions: a.submissions.map(s => (s.studentId === studentId ? { ...s, submitted: true } : s)) }
          : a
      )
    );
  }

  function handleAddAssignment(newAssignment) {
    const nextId = (assignments.length ? Math.max(...assignments.map(a => a.id)) : 0) + 1;
    setAssignments(prev => [...prev, { id: nextId, ...newAssignment }]);
  }

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar onNavigate={(p) => setActive(p)} active={active} />
        <main className="flex-1 p-4 max-w-5xl mx-auto">
          {/* simple internal routing by role */}
          <div>
            {/* role-aware rendering is handled inside page components using context */}
            <div className="md:hidden mb-4">
              <p className="text-sm text-gray-600">Mobile view: use the select in the navbar to change role.</p>
            </div>
            {/* decide which dashboard to show by consuming context inside pages */}
            <div className="bg-gray-50 p-4 rounded">
              <RoleBasedContent assignments={assignments} onSubmitToggle={handleSubmitToggle} onAddAssignment={handleAddAssignment} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// small wrapper that reads user role from context and shows the right page
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
function RoleBasedContent({ assignments, onSubmitToggle, onAddAssignment }) {
  const { currentUser } = useContext(UserContext);

  if (currentUser.role === "admin") {
    return <AdminDashboard assignments={assignments} onAddAssignment={onAddAssignment} onSubmitToggle={onSubmitToggle} />;
  } else {
    return <StudentDashboard assignments={assignments} onSubmitToggle={onSubmitToggle} />;
  }
}

export default function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-100">
        <AppInner />
      </div>
    </UserProvider>
  );
}
