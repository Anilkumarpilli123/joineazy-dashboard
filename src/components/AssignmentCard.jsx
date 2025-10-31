import React, { useState, useContext } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { UserContext } from "../context/UserContext";

export default function AssignmentCard({ assignment, onSubmitToggle, adminView = false }) {
  const { currentUser } = useContext(UserContext);
  const studentSubmission = assignment.submissions.find((s) => s.studentId === currentUser.id);
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onSubmitToggle(assignment.id, currentUser.id);
    setOpen(false);
  };

  return (
    <div className="bg-white shadow rounded p-4 border">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{assignment.title}</h2>
          <p className="text-gray-600">{assignment.description}</p>
          <p className="text-sm text-gray-500 mt-1">Due: {assignment.dueDate}</p>
        </div>

        <div className="text-right">
          {adminView ? (
            <a href={assignment.driveLink} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">Drive Link</a>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        {currentUser.role === "student" && (
          <>
            {studentSubmission && studentSubmission.submitted ? (
              <span className="inline-flex items-center gap-2 text-green-600 font-medium">✅ Submitted</span>
            ) : (
              <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => setOpen(true)}>Mark as Submitted</button>
            )}
          </>
        )}

        {currentUser.role === "admin" && (
          <div className="mt-2">
            <p className="font-medium">Submissions:</p>
            <div className="mt-1">
              {assignment.submissions.map((s) => (
                <div key={s.studentId} className="flex justify-between text-sm py-1 border-b">
                  <span>Student {s.studentId}</span>
                  <span>{s.submitted ? "✅" : "❌"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {open && <ConfirmationModal title="Confirm Submission" message="Have you submitted this assignment to the drive link? This cannot be undone." onConfirm={handleConfirm} onCancel={() => setOpen(false)} />}
    </div>
  );
}
