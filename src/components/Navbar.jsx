import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { currentUser, switchRole } = useContext(UserContext);

  return (
    <div className="flex justify-between items-center bg-blue-600 text-white p-4">
      <h1 className="text-xl font-semibold">Joineazy Dashboard</h1>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline">{currentUser.name} ({currentUser.role})</span>

        <select
          className="text-black p-1 rounded"
          value={currentUser.role}
          onChange={(e) => switchRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>
  );
}
