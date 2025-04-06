import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TaskList.css";

function MyTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/tasks/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Error while fetching tasks:", err);
      }
    };

    fetchMyTasks();
  }, []);

  return (
    <div className="task-list">
      <h2>🗂️ My Tasks</h2>
      {tasks.length === 0 ? (
        <p>You have no assigned tasks.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong> — {task.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyTasks;
