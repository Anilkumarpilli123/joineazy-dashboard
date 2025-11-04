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
    submissionType: "individual",
  });

  // Add assignment
  const handleAddAssignment = (e) => {
    e.preventDefault();
    const { title, description, submissionType } = newAssignment;

    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }

    const nextId =
      assignments.length > 0
        ? Math.max(...assignments.map((a) => a.id)) + 1
        : 1;

    const newEntry = {
      id: nextId,
      title: title.trim(),
      description: description.trim(),
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
    setNewAssignment({ title: "", description: "", submissionType: "individual" });
    toast.success("Assignment created successfully!");
  };

  // Update submission type
  const handleTypeChange = (id, type) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, submissionType: type } : a))
    );
    toast.info("Submission type updated");
  };

  // Edit assignment
  const handleEdit = (id, updated) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
    setEditId(null);
    toast.success("Assignment updated successfully!");
  };

  // Delete assignment
  const handleDelete = (id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    setConfirmDeleteId(null);
    toast.error("Assignment deleted");
  };

  const getStudentName = (id) =>
    users.find((u) => u.id === id)?.name || "Unknown";

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

      {/* Create Assignment Section */}
      <div className="bg-white shadow-md rounded-lg p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-blue-700 mb-3">
          Create New Assignment
        </h3>
        <form onSubmit={handleAddAssignment} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newAssignment.title}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, title: e.target.value })
              }
              placeholder="Enter title"
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newAssignment.description}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, description: e.target.value })
              }
              placeholder="Enter description"
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm focus:ring focus:ring-blue-300"
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Submission Type</label>
            <select
              value={newAssignment.submissionType}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, submissionType: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 mt-1 text-sm focus:ring focus:ring-blue-300"
            >
              <option value="individual">Individual</option>
              <option value="group">Group</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
           Add Assignment
          </button>
        </form>
      </div>

      {/* Assignment List */}
      {assignments.map((a) => (
        <div key={a.id} className="bg-white shadow rounded-lg p-5 border border-gray-100">
          {editId === a.id ? (
            <EditAssignmentForm
              assignment={a}
              onSave={(updated) => handleEdit(a.id, updated)}
              onCancel={() => setEditId(null)}
            />
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{a.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{a.description}</p>
                  <p className="text-sm text-gray-500">
                    Submissions:{" "}
                    <span className="font-medium text-gray-700">
                      {a.submissions?.filter((s) => s.acknowledged).length}
                    </span>{" "}
                    / {a.submissions?.length || 0}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={a.submissionType || "individual"}
                    onChange={(e) => handleTypeChange(a.id, e.target.value)}
                    className="border rounded-md px-3 py-1 text-sm focus:ring focus:ring-blue-300"
                  >
                    <option value="individual">Individual</option>
                    <option value="group">Group</option>
                  </select>
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

              {/* Group Details */}
              {a.submissionType === "group" && (
                <div className="mt-4">
                  <button
                    onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                  >
                    {expanded === a.id ? "Hide Groups" : "View Groups"}
                  </button>

                  {expanded === a.id && (
                    <div className="mt-3 bg-blue-50 rounded-md p-3 border border-blue-200 space-y-3">
                      {a.groups && a.groups.length > 0 ? (
                        a.groups.map((g) => (
                          <div key={g.groupId} className="bg-white border rounded-md p-3 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm font-semibold text-blue-700">
                                {g.name || g.groupId}
                              </p>
                              <p className="text-xs text-gray-500">ID: {g.groupId}</p>
                            </div>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {g.members.map((id) => (
                                <li key={id}>
                                  {getStudentName(id)}
                                  {id === g.leaderId && (
                                    <span className="text-xs text-blue-600 ml-1 font-medium">
                                      (Leader)
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">
                          No groups formed yet for this assignment.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Delete Confirmation Modal */}
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
      ))}
    </div>
  );
}

// Inline component for editing assignment
function EditAssignmentForm({ assignment, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: assignment.title,
    description: assignment.description,
    submissionType: assignment.submissionType,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-300"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-300"
          rows={3}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Submission Type</label>
        <select
          value={form.submissionType}
          onChange={(e) =>
            setForm({ ...form, submissionType: e.target.value })
          }
          className="w-full border rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-300"
        >
          <option value="individual">Individual</option>
          <option value="group">Group</option>
        </select>
      </div>
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
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}
