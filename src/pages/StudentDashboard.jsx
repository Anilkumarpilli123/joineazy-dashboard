import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import AssignmentList from "../components/AssignmentList";
import ProgressBar from "../components/ProgressBar";

export default function StudentDashboard({ assignments, onSubmitToggle }) {
  const { currentUser } = useContext(UserContext);

  const studentAssignments = assignments.filter(a => a.submissions.some(s => s.studentId === currentUser.id));
  const submittedCount = studentAssignments.filter(a => a.submissions.find(s => s.studentId === currentUser.id && s.submitted)).length;
  const progress = Math.round((submittedCount / (studentAssignments.length || 1)) * 100);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">My Assignments</h2>
      <ProgressBar progress={progress} />
      <div className="mt-4">
        <AssignmentList assignments={studentAssignments} onSubmitToggle={onSubmitToggle} />
      </div>
    </div>
  );
}
