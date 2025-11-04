import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import GroupModal from "../components/GroupModal";

export default function StudentDashboard({ assignments, setAssignments }) {
  const { currentUser, users } = useContext(UserContext);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [expandedGroup, setExpandedGroup] = useState(null); // 👈 tracks which group’s member list is open

  const updateAssignment = (updatedAssignment) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === updatedAssignment.id ? updatedAssignment : a))
    );
  };

  const handleAcknowledge = (assignmentId) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== assignmentId) return a;

        if (a.submissionType === "individual") {
          return {
            ...a,
            submissions: a.submissions.map((s) =>
              s.studentId === currentUser.id
                ? { ...s, acknowledged: true, timestamp: new Date().toISOString() }
                : s
            ),
          };
        }

        if (a.submissionType === "group") {
          const group = a.groups?.find((g) => g.members.includes(currentUser.id));
          if (!group) {
            toast.info("You are not part of any group. Form or join one to submit this assignment.");
            return a;
          }

          if (group.leaderId !== currentUser.id) {
            toast.warn("Only the group leader can acknowledge submission.");
            return a;
          }

          return {
            ...a,
            submissions: a.submissions.map((s) =>
              group.members.includes(s.studentId)
                ? { ...s, acknowledged: true, timestamp: new Date().toISOString() }
                : s
            ),
          };
        }

        return a;
      })
    );

    toast.success("✅ Acknowledgment submitted!");
  };

  const getStudentName = (id) => users.find((u) => u.id === id)?.name || "Unknown";

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Dashboard</h2>

      {assignments.map((a) => {
        const submission = a.submissions.find((s) => s.studentId === currentUser.id);
        const isAcknowledged = submission?.acknowledged;
        const time = submission?.timestamp
          ? new Date(submission.timestamp).toLocaleString()
          : null;

        const currentGroup = a.groups?.find((g) => g.members.includes(currentUser.id));

        return (
          <div
            key={a.id}
            className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700">{a.title}</h3>
              <p className="text-sm text-gray-600">{a.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Submission Type:{" "}
                <span className="font-medium text-blue-700">{a.submissionType}</span>
              </p>

              {/* Group Info Section */}
              {a.submissionType === "group" && currentGroup && (
                <div className="mt-2 border-t pt-2">
                  <p className="text-sm font-medium text-gray-700">
                    Your Group:{" "}
                    <span className="text-blue-700 font-semibold">
                      {currentGroup.name || currentGroup.groupId}
                    </span>
                  </p>
                  <button
                    onClick={() =>
                      setExpandedGroup(expandedGroup === currentGroup.groupId ? null : currentGroup.groupId)
                    }
                    className="mt-1 text-sm text-blue-600 underline hover:text-blue-800"
                  >
                    {expandedGroup === currentGroup.groupId
                      ? "Hide Members"
                      : "View Members"}
                  </button>

                  {expandedGroup === currentGroup.groupId && (
                    <div className="mt-2 bg-blue-50 rounded-md p-2 border border-blue-200">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Group Members:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {currentGroup.members.map((id) => (
                          <li key={id} className="flex items-center gap-2">
                            <span>
                              {getStudentName(id)}
                              {id === currentGroup.leaderId && (
                                <span className="text-xs text-blue-600 ml-1 font-medium">
                                  (Leader)
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-gray-500 mt-2">
                        Group ID: <span className="font-mono">{currentGroup.groupId}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              {a.submissionType === "group" && (
                <button
                  onClick={() => setActiveAssignment(a)}
                  className="text-sm bg-gray-100 px-3 py-1 rounded-md border hover:bg-gray-200"
                >
                  Form / Join Group
                </button>
              )}

              {isAcknowledged ? (
                <p className="text-green-600 text-sm font-medium">
                  ✅ Acknowledged on {time}
                </p>
              ) : (
                <button
                  onClick={() => handleAcknowledge(a.id)}
                  className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
                >
                  Yes, I have submitted
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Group Modal */}
      {activeAssignment && (
        <GroupModal
          assignment={activeAssignment}
          onClose={() => setActiveAssignment(null)}
          onUpdateAssignment={updateAssignment}
        />
      )}
    </div>
  );
}
