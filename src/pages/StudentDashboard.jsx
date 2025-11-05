  import React, { useContext, useState } from "react";
  import { UserContext } from "../context/UserContext";
  import { toast } from "react-toastify";
  import GroupModal from "../components/GroupModal";

  export default function StudentDashboard({ assignments, setAssignments }) {
    const { currentUser, users } = useContext(UserContext);
    const [activeAssignment, setActiveAssignment] = useState(null);
    const [expandedGroup, setExpandedGroup] = useState(null);

    // 🧩 Handle acknowledgment
    // ✅ Prevent double toast using a state guard
  const handleAcknowledge = (assignmentId) => {
    let toastShown = false; // 🔹 Prevent multiple toasts

    setAssignments((prevAssignments) => {
      const updatedAssignments = prevAssignments.map((a) => {
        if (a.id !== assignmentId) return a;

        const submissions = a.submissions || [];

        // INDIVIDUAL
        if (a.submissionType === "individual") {
          const updatedSubmissions = submissions.map((s) =>
            s.studentId === currentUser.id
              ? { ...s, acknowledged: true, timestamp: new Date().toISOString() }
              : s
          );

          if (!toastShown) {
            toast.success("Acknowledgment submitted!");
            toastShown = true;
          }

          return { ...a, submissions: updatedSubmissions };
        }

        // GROUP
        if (a.submissionType === "group") {
          const group = a.groups?.find((g) => g.members.includes(currentUser.id));
          if (!group) {
            if (!toastShown) {
              toast.info("You are not part of any group. Form or join one to submit this assignment.");
              toastShown = true;
            }
            return a;
          }

          if (group.leaderId !== currentUser.id) {
            if (!toastShown) {
              toast.warn("Only the group leader can acknowledge submission.");
              toastShown = true;
            }
            return a;
          }

          const updatedSubmissions = submissions.map((s) =>
            group.members.includes(s.studentId)
              ? { ...s, acknowledged: true, timestamp: new Date().toISOString() }
              : s
          );

          if (!toastShown) {
            toast.success("Acknowledgment submitted!");
            toastShown = true;
          }

          return { ...a, submissions: updatedSubmissions };
        }

        return a;
      });

      // ✅ Update localStorage once (not triggering another re-render)
      localStorage.setItem("joineazy_assignments", JSON.stringify(updatedAssignments));

      return updatedAssignments;
    });
  };


    // 🔍 Helpers
    const getStudentName = (id) => users.find((u) => u.id === id)?.name || "Unknown";

    const getProgressPercent = (a) => {
      const total = a.submissions?.length || 1;
      const acknowledged = a.submissions?.filter((s) => s.acknowledged).length;
      return Math.round((acknowledged / total) * 100);
    };

    // 🧠 Render
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Dashboard</h2>

        {assignments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-lg font-medium">
              No assignments created yet.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Please check back later once your instructor creates one.
            </p>
          </div>
        ) : (
          assignments.map((a) => {
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
                {/* Header */}
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

                    {/* 📁 OneDrive Link */}
                    {a.driveLink ? (
                      <p className="mt-2">
                        <a
                          href={a.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm underline hover:text-blue-800"
                        >
                          Open OneDrive Submission Folder
                        </a>
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm mt-2 italic">
                        No OneDrive link provided
                      </p>
                    )}

                    {/* 👥 Group Info */}
                    {a.submissionType === "group" && currentGroup && (
                      <div className="mt-3 border-t pt-2">
                        <p className="text-sm font-medium text-gray-700">
                          Your Group:{" "}
                          <span className="text-blue-700 font-semibold">
                            {currentGroup.name || currentGroup.groupId}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">

                    {a.submissionType === "group" && (
      <>
        {!currentGroup ? (
          <button
            onClick={() => setActiveAssignment(a)}
            className="text-sm bg-gray-100 px-3 py-1 rounded-md border hover:bg-gray-200 transition"
          >
            Form / Join Group
          </button>
        ) : (
          <p className="text-sm text-gray-600 italic">
            You are part of{" "}
            <span className="font-medium text-blue-700">
              {currentGroup.name || currentGroup.groupId}
            </span>
          </p>
        )}
      </>
    )}
                  
                    {isAcknowledged ? (
                      <>
                        <p className="text-green-600 text-sm font-medium">
                          ✅ Acknowledged on {time}
                        </p>
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-md">
                          Acknowledged
                        </span>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAcknowledge(a.id)}
                          className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
                        >
                          Yes, I have submitted
                        </button>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                          Pending Acknowledgment
                        </span>
                      </>
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
          })
        )}

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
