export const users = [
  {
    id: 1,
    name: "Anil Kumar",
    email: "anil@example.com",
    password: "123456",
    role: "student",
  },
  {
    id: 2,
    name: "Swathi Rao",
    email: "swathi@example.com",
    password: "123456",
    role: "student",
  },
  {
    id: 3,
    name: "Vijay Sharma",
    email: "vijay@example.com",
    password: "123456",
    role: "student",
  },
  {
    id: 4,
    name: "Professor Meena",
    email: "meena@college.edu",
    password: "admin123",
    role: "admin",
  },
];

// Default assignments
export const initialAssignments = [
  {
    id: 1,
    title: "Frontend Dashboard UI",
    description: "Build a dashboard using React + Tailwind CSS.",
    deadline: "2025-11-15T23:59:00", // 🕒 Added deadline
    driveLink: "https://drive.google.com/drive/folders/frontend-dashboard-ui", // 📁 Added drive folder
    submissionType: "individual",
    submissions: [],
    groups: [],
  },
  {
    id: 2,
    title: "Team Portfolio Project",
    description: "Work in a group to create a responsive team portfolio website.",
    deadline: "2025-11-20T23:59:00", // 🕒 Added deadline
    driveLink: "https://drive.google.com/drive/folders/team-portfolio-project", // 📁 Added drive folder
    submissionType: "group",
    submissions: [],
    groups: [
      {
        groupId: "G1001",
        name: "Team Innovators",
        leaderId: 1,
        members: [1, 2],
      },
      {
        groupId: "G1002",
        name: "Team Vision",
        leaderId: 3,
        members: [3],
      },
    ],
  },
  {
    id: 3,
    title: "React Mini Project",
    description: "Develop a small interactive project using React hooks.",
    deadline: "2025-11-25T23:59:00", // 🕒 Added deadline
    driveLink: "https://drive.google.com/drive/folders/react-mini-project", // 📁 Added drive folder
    submissionType: "individual",
    submissions: [],
    groups: [],
  },
];
