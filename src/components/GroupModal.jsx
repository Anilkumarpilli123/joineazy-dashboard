import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

export default function GroupModal({ assignment, onClose, onUpdateAssignment }) {
  const { currentUser } = useContext(UserContext);
  const [groupName, setGroupName] = useState("");
  const [joinGroupId, setJoinGroupId] = useState("");
  const [tab, setTab] = useState("create");  

  const handleCreate = () => {
    if (!groupName.trim()) {
      toast.error("Enter a group name");
      return;
    }

    const newGroupId = `G${Math.floor(Math.random() * 9000 + 1000)}`;

    const newGroup = {
      groupId: newGroupId,
      name: groupName.trim(),
      leaderId: currentUser.id,
      members: [currentUser.id],
    };

    onUpdateAssignment({
      ...assignment,
      groups: [...(assignment.groups || []), newGroup],
    });

    toast.success(`✅ Group '${groupName}' created successfully!`);
    onClose();
  };

  const handleJoin = () => {
    if (!joinGroupId.trim()) {
      toast.error("Enter group ID to join");
      return;
    }

    const existingGroup = assignment.groups?.find(
      (g) => g.groupId.toLowerCase() === joinGroupId.toLowerCase()
    );

    if (!existingGroup) {
      toast.error("Group not found!");
      return;
    }

    if (existingGroup.members.includes(currentUser.id)) {
      toast.info("You're already a member of this group!");
      return;
    }

    const updatedGroup = {
      ...existingGroup,
      members: [...existingGroup.members, currentUser.id],
    };

    const updatedAssignment = {
      ...assignment,
      groups: assignment.groups.map((g) =>
        g.groupId === existingGroup.groupId ? updatedGroup : g
      ),
    };

    onUpdateAssignment(updatedAssignment);
    toast.success("✅ Joined group successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          {tab === "create" ? "Create a Group" : "Join a Group"}
        </h2>

        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-1 rounded-l-md ${
              tab === "create" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTab("create")}
          >
            Create
          </button>
          <button
            className={`px-4 py-1 rounded-r-md ${
              tab === "join" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTab("join")}
          >
            Join
          </button>
        </div>

        {tab === "create" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="border rounded-md w-full p-2 mb-3 focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleCreate}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Create Group
            </button>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group ID
            </label>
            <input
              type="text"
              value={joinGroupId}
              onChange={(e) => setJoinGroupId(e.target.value)}
              className="border rounded-md w-full p-2 mb-3 focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleJoin}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Join Group
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}
