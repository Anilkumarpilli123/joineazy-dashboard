import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function CreateAssignmentForm({ onAdd, students }) {
  const { currentUser } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [driveLink, setDriveLink] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const newAssignment = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      driveLink,
      createdBy: currentUser.id,
      submissions: students.map((s) => ({ studentId: s.id, submitted: false }))
    };
    onAdd(newAssignment);
    setTitle(""); setDescription(""); setDueDate(""); setDriveLink("");
  }

  return (
    <form className="bg-white p-4 rounded shadow mb-4" onSubmit={handleSubmit}>
      <h3 className="font-semibold mb-2">Create New Assignment</h3>
      <input className="border p-2 w-full mb-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="border p-2 w-full mb-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input className="border p-2 w-full mb-2" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <input className="border p-2 w-full mb-2" placeholder="Drive Link" value={driveLink} onChange={(e) => setDriveLink(e.target.value)} />
      <button className="bg-blue-600 text-white px-3 py-1 rounded">Add Assignment</button>
    </form>
  );
}
