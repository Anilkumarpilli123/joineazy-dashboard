import React from "react";

export default function ConfirmationModal({ title = "Confirm", message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-11/12 max-w-md">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="mt-2 text-sm text-gray-700">{message}</p>
        <div className="mt-4 flex justify-end gap-3">
          <button className="px-4 py-1 rounded bg-gray-300" onClick={onCancel}>Cancel</button>
          <button className="px-4 py-1 rounded bg-green-600 text-white" onClick={onConfirm}>Yes, submit</button>
        </div>
      </div>
    </div>
  );
}
