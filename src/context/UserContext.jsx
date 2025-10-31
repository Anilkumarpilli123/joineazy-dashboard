import React, { createContext, useState, useEffect } from "react";
import { users as seededUsers } from "../data/mockData";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [users] = useState(seededUsers);
  const [currentUser, setCurrentUser] = useState(() => {
    // default to first user
    const saved = localStorage.getItem("joineazy_current_user");
    return saved ? JSON.parse(saved) : seededUsers[0];
  });

  useEffect(() => {
    localStorage.setItem("joineazy_current_user", JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (role) => {
    const next = users.find((u) => u.role === role);
    if (next) setCurrentUser(next);
  };

  return (
    <UserContext.Provider value={{ users, currentUser, setCurrentUser, switchRole }}>
      {children}
    </UserContext.Provider>
  );
}
