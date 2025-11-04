import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.info("Logging out...");
    setTimeout(() => {
      localStorage.removeItem("joineazy_current_user");
      localStorage.removeItem("joineazy_token");
      setCurrentUser(null);
      navigate("/auth");
      toast.success("Logged out successfully!");
    }, 800);
  };

  if (!currentUser) return null;

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex items-center justify-between sticky top-0 z-50">
      <h1 className="text-xl font-semibold text-blue-700">Joineazy Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-700 text-sm">
          Logged in as:{" "}
          <span className="font-medium text-blue-600 capitalize">
            {currentUser.role}
          </span>
        </span>

        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
