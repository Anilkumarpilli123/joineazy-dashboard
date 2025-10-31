import React from "react";

export default function ProgressBar({ progress }) {
  const safe = Math.max(0, Math.min(100, progress || 0));
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
      <div className="bg-green-500 h-3 rounded-full" style={{ width: `${safe}%` }} />
    </div>
  );
}
