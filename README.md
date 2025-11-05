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
- **Admin(Professor):** Can create new assignments and view student submissions.
- **Student:** Can view assigned tasks, mark them as submitted, and track completion.

The App.jsx dynamically renders either the AdminDashboard or StudentDashboard based on the active user role.

## State Management

All data (assignments and user state) is persisted in localStorage to maintain state across refreshes.

## Component Composition

The dashboard is composed of modular, reusable UI components:

- **Navbar:** Central role & user switcher with student/admin dropdowns.
- **Sidebar:** Navigation area to switch dashboard views.
- **AssignmentList / Card:** Display assignments dynamically based on user role.
- **CreateAssignmentForm:** Used by admins to add new tasks.
- **ProgressBar:** Shows assignment completion visually. 
