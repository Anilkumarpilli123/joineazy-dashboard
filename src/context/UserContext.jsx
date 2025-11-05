import React, { createContext, useState, useEffect } from "react";
import { users as seededUsers } from "../data/mockData";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load users
    const savedUsers = localStorage.getItem("joineazy_users");
    const parsedUsers = savedUsers ? JSON.parse(savedUsers) : seededUsers;
    setUsers(parsedUsers);

    // Load current user
    const savedCurrent = localStorage.getItem("joineazy_current_user");
    setCurrentUser(savedCurrent ? JSON.parse(savedCurrent) : null);
    setReady(true);
  }, []);

  // Persist users
  useEffect(() => {
    if (ready) {
      localStorage.setItem("joineazy_users", JSON.stringify(users));
    }
  }, [users, ready]);

  // Persist current user
  useEffect(() => {
    if (ready) {
      if (currentUser) {
        localStorage.setItem("joineazy_current_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("joineazy_current_user");
      }
    }
  }, [currentUser, ready]);

  const switchRole = (role) => {
    const next = users.find((u) => u.role === role);
    if (next) setCurrentUser(next);
  };

  if (!ready) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading user data...
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ users, setUsers, currentUser, setCurrentUser, switchRole }}>
      {children}
    </UserContext.Provider>
  );
}
