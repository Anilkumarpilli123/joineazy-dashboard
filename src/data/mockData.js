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

// ✅ Default assignments
export const initialAssignments = [
  {
    id: 1,
    title: "Frontend Dashboard UI",
    description: "Build a dashboard using React + Tailwind CSS.",
    submissionType: "individual",
    submissions: [
      { studentId: 1, acknowledged: false, timestamp: null },
      { studentId: 2, acknowledged: false, timestamp: null },
      { studentId: 3, acknowledged: false, timestamp: null },
    ],
    groups: [],
  },
  {
    id: 2,
    title: "Team Portfolio Project",
    description:
      "Work in a group to create a responsive team portfolio website.",
    submissionType: "group",
    submissions: [
      { studentId: 1, acknowledged: false, timestamp: null },
      { studentId: 2, acknowledged: false, timestamp: null },
      { studentId: 3, acknowledged: false, timestamp: null },
    ],
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
    submissionType: "individual",
    submissions: [
      { studentId: 1, acknowledged: true, timestamp: "2025-11-03T11:30:00Z" },
      { studentId: 2, acknowledged: false, timestamp: null },
      { studentId: 3, acknowledged: false, timestamp: null },
    ],
    groups: [],
  },
];
