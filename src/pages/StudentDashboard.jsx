import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import GroupModal from "../components/GroupModal";

export default function StudentDashboard({ assignments, setAssignments }) {
  const { currentUser, users } = useContext(UserContext);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [expandedGroup, setExpandedGroup] = useState(null);

  // Acknowledge Submission Logic
  const handleAcknowledge = (assignmentId) => {
    let toastMessage = null;
    let toastType = "info";

    setAssignments((prevAssignments) => {
      const updated = prevAssignments.map((a) => {
        if (a.id !== assignmentId) return a;

        const submissions = a.submissions?.length
          ? a.submissions
          : users
              .filter((u) => u.role === "student")
              .map((s) => ({
                studentId: s.id,
                acknowledged: false,
                timestamp: null,
              }));

        // Individual Submission
        if (a.submissionType === "individual") {
          toastMessage = "Acknowledgment submitted!";
          toastType = "success";
          return {
            ...a,
            submissions: submissions.map((s) =>
              s.studentId === currentUser.id
                ? {
                    ...s,
                    acknowledged: true,
                    timestamp: new Date().toISOString(),
                  }
                : s
            ),
          };
        }

        // 👥 Group Submission
        if (a.submissionType === "group") {
          const group = a.groups?.find((g) =>
            g.members.includes(currentUser.id)
          );

          if (!group) {
            toastMessage =
              "You are not part of any group. Form or join one to submit this assignment.";
            toastType = "info";
            return a;
          }

          if (group.leaderId !== currentUser.id) {
            toastMessage = "Only the group leader can acknowledge submission.";
            toastType = "warn";
            return a;
          }

          toastMessage = "Group acknowledgment submitted!";
          toastType = "success";

          return {
            ...a,
            submissions: submissions.map((s) =>
              group.members.includes(s.studentId)
                ? {
                    ...s,
                    acknowledged: true,
                    timestamp: new Date().toISOString(),
                  }
                : s
            ),
          };
        }

        return a;
      });

      return [...updated];
    });

    // Toast shown once
    setTimeout(() => {
      if (toastMessage) {
        if (toastType === "success") toast.success(toastMessage);
        else if (toastType === "warn") toast.warn(toastMessage);
        else toast.info(toastMessage);
      }
    }, 150);
  };

  // Helper to get student name
  const getStudentName = (id) =>
    users.find((u) => u.id === id)?.name || "Unknown";

  // Progress calculation
  const getProgressPercent = (a) => {
    const total = a.submissions?.length || 1;
    const acknowledged = a.submissions?.filter((s) => s.acknowledged).length;
    return Math.round((acknowledged / total) * 100);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Student Dashboard
      </h2>

      {assignments.map((a) => {
        const submission = a.submissions.find(
          (s) => s.studentId === currentUser.id
        );
        const isAcknowledged = submission?.acknowledged;
        const time = submission?.timestamp
          ? new Date(submission.timestamp).toLocaleString()
          : null;

        const currentGroup = a.groups?.find((g) =>
          g.members.includes(currentUser.id)
        );

        const progress = getProgressPercent(a);

        return (
          <div
            key={a.id}
            className="bg-white shadow-md rounded-lg p-5 mb-5 transition-all duration-200 hover:shadow-lg"
          >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {a.title}
                </h3>
                <p className="text-sm text-gray-600">{a.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Submission Type:{" "}
                  <span className="font-medium text-blue-700">
                    {a.submissionType}
                  </span>
                </p>

                {a.deadline && (
                  <p className="text-sm text-red-600 mt-1">
                    Deadline:{" "}
                    <span className="font-semibold">
                      {new Date(a.deadline).toLocaleString()}
                    </span>
                  </p>
                )}

                {a.driveLink && (
                  <p className="mt-2">
                    <a
                      href={a.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm underline hover:text-blue-800"
                    >
                     Open Drive Folder
                    </a>
                  </p>
                )}

                {/* Group Section */}
                {a.submissionType === "group" && currentGroup && (
                  <div className="mt-3 border-t pt-2">
                    <p className="text-sm font-medium text-gray-700">
                      Your Group:{" "}
                      <span className="text-blue-700 font-semibold">
                        {currentGroup.name || currentGroup.groupId}
                      </span>
                    </p>
                    <button
                      onClick={() =>
                        setExpandedGroup(
                          expandedGroup === currentGroup.groupId
                            ? null
                            : currentGroup.groupId
                        )
                      }
                      className="mt-1 text-sm text-blue-600 underline hover:text-blue-800"
                    >
                      {expandedGroup === currentGroup.groupId
                        ? "Hide Members"
                        : "View Members"}
                    </button>

                    {expandedGroup === currentGroup.groupId && (
                      <div className="mt-2 bg-blue-50 rounded-md p-2 border border-blue-200">
                        <p className="text-xs font-semibold text-gray-600 mb-1">
                          Group Members:
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {currentGroup.members.map((id) => (
                            <li key={id}>
                              {getStudentName(id)}
                              {id === currentGroup.leaderId && (
                                <span className="text-xs text-blue-600 ml-1 font-medium">
                                  (Leader)
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions Section */}
              <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                {a.submissionType === "group" && (
                  <button
                    onClick={() => setActiveAssignment(a)}
                    className="text-sm bg-gray-100 px-3 py-1 rounded-md border hover:bg-gray-200 transition"
                  >
                    Form / Join Group
                  </button>
                )}

                {isAcknowledged ? (
                  <p className="text-green-600 text-sm font-medium">
                  Acknowledged on {time}
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

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{progress}% submitted</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Group Modal */}
      {activeAssignment && (
        <GroupModal
          assignment={activeAssignment}
          onClose={() => setActiveAssignment(null)}
          onUpdateAssignment={(updated) =>
            setAssignments((prev) =>
              prev.map((a) => (a.id === updated.id ? updated : a))
            )
          }
        />
      )}
    </div>
  );
}
