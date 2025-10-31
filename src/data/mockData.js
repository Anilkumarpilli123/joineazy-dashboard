export const users = [
  { id: 1, name: "Anil Kumar", role: "student" },
  { id: 2, name: "Professor Raj", role: "admin" }
];

export const initialAssignments = [
  {
    id: 1,
    title: "React Basics",
    description: "Build a simple component-based UI",
    dueDate: "2025-11-02",
    driveLink: "https://drive.google.com/",
    createdBy: 2,
    submissions: [{ studentId: 1, submitted: false }]
  }
];
