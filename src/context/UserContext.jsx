import React, { createContext, useState, useEffect } from "react";
import { users as seededUsers } from "../data/mockData";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("joineazy_users");
    return saved ? JSON.parse(saved) : seededUsers;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("joineazy_current_user");
    return saved ? JSON.parse(saved) : null; // ✅ Start with null, not seededUsers[0]
  });

  useEffect(() => {
    localStorage.setItem("joineazy_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser)
      localStorage.setItem("joineazy_current_user", JSON.stringify(currentUser));
    else
      localStorage.removeItem("joineazy_current_user"); // ✅ clear when logged out
  }, [currentUser]);

  const switchRole = (role) => {
    const next = users.find((u) => u.role === role);
    if (next) setCurrentUser(next);
  };

  return (
    <UserContext.Provider
      value={{ users, setUsers, currentUser, setCurrentUser, switchRole }}
    >
      {children}
    </UserContext.Provider>
  );
}
