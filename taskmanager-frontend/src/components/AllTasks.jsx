import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TaskList.css";

function AllTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Error while fetching tasks:", err);
      }
    };

    fetchAllTasks();
  }, []);

  return (
    <div className="task-list">
      <h2>📋 All Tasks</h2>
      {tasks.length === 0 ? (
        <p>There are no tasks available.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong> — {task.status} <br />
              <small>Assigned to: {task.assignedTo.username}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AllTasks;
