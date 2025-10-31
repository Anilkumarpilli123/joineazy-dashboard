# Joineazy Dashboard

A modern **React + Vite** dashboard application for managing student assignments and progress, built as part of the **Joineazy Internship Task-1**.

This dashboard provides role-based views for **students** and **admins**, enabling easy tracking of assignments, submissions, and progress — all styled with **Tailwind CSS**.

---

## Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Storage:** LocalStorage (for persistence)
- **Deployment:** GitHub Pages / Netlify

---

## Live Demo 

 **Netlify Deployment:** [https://joineazy-dashboard.netlify.app/](https://joineazy-dashboard.netlify.app/) 
 
 **GitHub Pages:** [https://anilkumarpilli123.github.io/joineazy-dashboard/](https://anilkumarpilli123.github.io/joineazy-dashboard/)  

---

## Project Setup Instructions

### 1️ Clone the Repository
```bash
git clone https://github.com/Anilkumarpilli123/joineazy-dashboard.git
cd joineazy-dashboard

```

# **Architecture Overview**

## Role-Based Rendering

The app uses the Context API (UserContext.jsx) to manage the current user and their role (student or admin).
- **Admin:** Can create new assignments and view student submissions.
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
