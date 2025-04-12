import React, { useState, useEffect } from "react";
import "../styles/CreateTaskForm.css";
import API from "../api/api";

function CreateTaskFormForProject({ projectId, onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedToId: "",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/users/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching employees", err);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        assignedTo: { id: formData.assignedToId },
        project: { id: projectId },
      };

      await API.post("/tasks", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onTaskCreated();
      setFormData({ title: "", description: "", dueDate: "", assignedToId: "" });
    } catch (error) {
      console.error("Task creation failed:", error);
      alert("Task could not be created.");
    }
  };

  return (
    <div className="create-task-form">
      <h4>➕ Create Task for This Project</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
        <select
          name="assignedToId"
          value={formData.assignedToId}
          onChange={handleChange}
          required
        >
          <option value="">Select Employee</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>

        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default CreateTaskFormForProject;
