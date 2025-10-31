// src/pages/AdminDashboard.jsx
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import CreateAssignmentForm from "../components/CreateAssignmentForm";
import AssignmentList from "../components/AssignmentList";

export default function AdminDashboard({ assignments, onAddAssignment, onSubmitToggle }) {
  const { users, currentUser } = useContext(UserContext);
  const myAssignments = assignments.filter(a => a.createdBy === currentUser.id);
  const students = users.filter(u => u.role === "student");

  return (
    <div>
      <CreateAssignmentForm onAdd={onAddAssignment} students={students} />
      <h2 className="text-xl font-semibold mb-3">Assignments I Created</h2>
      <AssignmentList assignments={myAssignments} onSubmitToggle={onSubmitToggle} adminView />
    </div>
  );
}
