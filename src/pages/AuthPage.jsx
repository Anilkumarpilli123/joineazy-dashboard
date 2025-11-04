import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { setUsers, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  // Load all users from localStorage
  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem("joineazy_users");
    return saved ? JSON.parse(saved) : [];
  });

  // Save users persistently
  useEffect(() => {
    localStorage.setItem("joineazy_users", JSON.stringify(allUsers));
  }, [allUsers]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password || (!isLogin && !form.name)) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (isLogin) {
      // LOGIN FLOW
      const existingUser = allUsers.find((u) => u.email === form.email);

      if (!existingUser) {
        toast.error("No account found with this email. Please register first.");
        return;
      }

      if (existingUser.password !== form.password) {
        toast.error("Invalid credentials. Please check your email or password.");
        return;
      }

      // Login success
      localStorage.setItem("joineazy_current_user", JSON.stringify(existingUser));
      setCurrentUser(existingUser);
      toast.success(`Welcome back, ${existingUser.name}!`);

      setTimeout(() => {
        navigate(existingUser.role === "admin" ? "/admin" : "/student");
      }, 700);
    } else {
      // REGISTER FLOW
      const userExists = allUsers.some((u) => u.email === form.email);
      if (userExists) {
        toast.error("User with this email already exists!");
        return;
      }

      const newUser = {
        id: allUsers.length + 1,
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      const updatedUsers = [...allUsers, newUser];
      setAllUsers(updatedUsers);
      setUsers(updatedUsers);
      localStorage.setItem("joineazy_current_user", JSON.stringify(newUser));
      setCurrentUser(newUser);

      toast.success("Account created successfully!");

      setTimeout(() => {
        navigate(newUser.role === "admin" ? "/admin" : "/student");
      }, 700);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          {isLogin ? "Welcome Back!" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
            />
          )}

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          >
            <option value="student">Student</option>
            <option value="admin">Professor</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium shadow hover:bg-blue-700 transition"
          >
            {isLogin ? "Login" : "Register"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
