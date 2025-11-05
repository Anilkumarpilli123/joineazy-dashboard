# Joineazy Dashboard

The Joineazy Dashboard is a modern React + Vite application built to streamline assignment management between professors and students. It provides a complete role-based interface for creating, submitting, and tracking academic assignments, including both individual and group submissions.

---

## Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Storage:** LocalStorage (for persistence)
- **Notifications:** React Toastify
- **Animations:** Framer Motion
- **Deployment:** Netlify

---

## Live Demo 

 **Netlify Deployment:** [https://joineazy-dashboard.netlify.app/](https://joineazy-dashboard.netlify.app/) 

---

## Project Setup Instructions

### Clone the Repository
```bash
git clone https://github.com/Anilkumarpilli123/joineazy-dashboard.git
cd joineazy-dashboard

```

# **Architecture Overview**

## Role-Based Rendering

The app uses the Context API (UserContext.jsx) to manage the current user and their role (student or admin).
- **Admin(Professor):**
     - Can create, edit, and delete assignments.
     - Can view student acknowledgments and submission progress.
     - For group assignments, can view group names, group IDs, and group members.
       
- **Student:**
     - Can view all assignments created by the admin.
     - Can acknowledge submission (“Yes, I have submitted”).
     - Can form or join groups for group-type assignments.
     - Sees timestamped acknowledgment updates once submitted.

The App.jsx dynamically renders either the AdminDashboard or StudentDashboard based on the active user role.

## State Management

All data (assignments and user state) is persisted in localStorage to maintain state across refreshes.

## Component Composition

The dashboard follows a modular structure for clarity and scalability:

- **Navbar:** Provides role switch and logout options.
- **Sidebar:** Simplified navigation for dashboard pages.
- **AdminDashboard:** Allows creating, editing, and managing assignments and viewing progress.
- **StudentDashboard:** Displays assignments, submission status, and OneDrive links.
- **GroupModal:** Enables students to create or join groups dynamically.
- **UserContext:** Handles global user authentication and role switching.


