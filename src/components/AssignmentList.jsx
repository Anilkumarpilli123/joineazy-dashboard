import React from "react";
import AssignmentCard from "./AssignmentCard";

export default function AssignmentList({ assignments, onSubmitToggle, adminView = false }) {
  if (!assignments || assignments.length === 0) {
    return <div className="text-gray-600">No assignments to show.</div>;
  }

  return (
    <div className="grid gap-4">
      {assignments.map((a) => (
        <AssignmentCard key={a.id} assignment={a} onSubmitToggle={onSubmitToggle} adminView={adminView} />
      ))}
    </div>
  );
}
