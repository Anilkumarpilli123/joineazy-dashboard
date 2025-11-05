import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

export default function AdminDashboard({ assignments, setAssignments }) {
  const { users } = useContext(UserContext);
  const [expanded, setExpanded] = useState(null);
  const [editId, setEditId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    deadline: "",
    driveLink: "",
    submissionType: "individual",
  });

  // Add new assignment
  const handleAddAssignment = (e) => {
    e.preventDefault();
    const { title, description, deadline, driveLink, submissionType } = newAssignment;

    if (!title.trim() || !description.trim() || !deadline.trim() ) {
      toast.error("Please fill in all fields!");
      return;
    }

    const nextId =
      assignments.length > 0 ? Math.max(...assignments.map((a) => a.id)) + 1 : 1;

    const newEntry = {
      id: nextId,
      title: title.trim(),
      description: description.trim(),
      deadline,
      driveLink,
      submissionType,
      submissions: users
        .filter((u) => u.role === "student")
        .map((s) => ({
          studentId: s.id,
          acknowledged: false,
          timestamp: null,
        })),
      groups: [],
    };

    setAssignments((prev) => [...prev, newEntry]);
    setNewAssignment({
      title: "",
      description: "",
      deadline: "",
      driveLink: "",
      submissionType: "individual",
    });
    toast.success("Assignment created successfully!");
  };

  // Edit assignment
  const handleEdit = (id, updated) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
    setEditId(null);
    toast.success("Assignment updated successfully!");
  };

  // Delete assignment
  const handleDelete = (id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    setConfirmDeleteId(null);
    toast.error("Assignment deleted");
  };

  // Helper: Get student name
  const getStudentName = (id) =>
    users.find((u) => u.id === id)?.name || "Unknown";

  // Helper: Calculate submission stats
  const getSubmissionStats = (a) => {
    const total = a.submissions?.length || 0;
    const submitted = a.submissions?.filter((s) => s.acknowledged).length || 0;
    const percent = total ? Math.round((submitted / total) * 100) : 0;
    return { total, submitted, percent };
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Professor Dashboard</h2>

      {/* Create Assignment */}
      <div className="bg-white shadow-md rounded-lg p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-blue-700 mb-3">
          Create New Assignment
        </h3>
        <form onSubmit={handleAddAssignment} className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newAssignment.title}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, title: e.target.value })
              }
              placeholder="Enter title"
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="datetime-local"
              value={newAssignment.deadline}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, deadline: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newAssignment.description}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, description: e.target.value })
              }
              placeholder="Enter description"
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">OneDrive Link</label>
            <input
              type="url"
              value={newAssignment.driveLink}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, driveLink: e.target.value })
              }
              placeholder="Enter OneDrive/Drive link"
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Submission Type</label>
            <select
              value={newAssignment.submissionType}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, submissionType: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm"
            >
              <option value="individual">Individual</option>
              <option value="group">Group</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Add Assignment
            </button>
          </div>
        </form>
      </div>

      {/* Assignment List */}
      {assignments.map((a) => {
        const { total, submitted, percent } = getSubmissionStats(a);
        return (
          <div
            key={a.id}
            className="bg-white shadow rounded-lg p-5 border border-gray-100"
          >
            {editId === a.id ? (
              <EditAssignmentForm
                assignment={a}
                onSave={(updated) => handleEdit(a.id, updated)}
                onCancel={() => setEditId(null)}
              />
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">{a.title}</h3>
                    <p className="text-sm text-gray-600">{a.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Deadline:{" "}
                      <span className="font-medium text-red-600">
                        {new Date(a.deadline).toLocaleString()}
                      </span>
                    </p>

                    <a
                      href={a.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline mt-1 block"
                    >
                      Open Drive Folder
                    </a>

                    <div className="mt-2">
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {submitted}/{total} submissions ({percent}%)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditId(a.id)}
                      className="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md hover:bg-yellow-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(a.id)}
                      className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-md hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Delete Confirmation */}
            {confirmDeleteId === a.id && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="bg-white rounded-lg shadow-lg p-5 w-80">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Confirm Delete
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to delete "{a.title}"?
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3 py-1 border rounded-md text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Inline Edit Form
function EditAssignmentForm({ assignment, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: assignment.title,
    description: assignment.description,
    deadline: assignment.deadline,
    driveLink: assignment.driveLink,
    submissionType: assignment.submissionType,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full border rounded-md px-3 py-2 text-sm"
      />
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full border rounded-md px-3 py-2 text-sm"
        rows={3}
      />
      <input
        type="datetime-local"
        value={form.deadline}
        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        className="w-full border rounded-md px-3 py-2 text-sm"
      />
      <input
        type="url"
        value={form.driveLink}
        onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
        className="w-full border rounded-md px-3 py-2 text-sm"
        placeholder="Drive link"
      />
      <select
        value={form.submissionType}
        onChange={(e) => setForm({ ...form, submissionType: e.target.value })}
        className="w-full border rounded-md px-3 py-2 text-sm"
      >
        <option value="individual">Individual</option>
        <option value="group">Group</option>
      </select>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 border rounded-md text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}
