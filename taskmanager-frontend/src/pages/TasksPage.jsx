import React, { useState } from "react";
import MyTasks from "../components/MyTasks";
import AllTasks from "../components/AllTasks";
import CreateTask from "../components/CreateTask";
import "../styles/TasksPage.css";

function TasksPage({ role }) {
  const [activeSection, setActiveSection] = useState("my");

  return (
    <div className="tasks-layout">
      <aside className="sidebar">
        <button onClick={() => setActiveSection("my")}>🗂️ My Tasks</button>
        <button onClick={() => setActiveSection("all")}>📋 All Tasks</button>
        {role === "MANAGER" && (
          <button onClick={() => setActiveSection("create")}>➕ Create Task</button>
        )}
      </aside>

      <div className="content">
        {activeSection === "my" && <MyTasks />}
        {activeSection === "all" && <AllTasks />}
        {activeSection === "create" && role === "MANAGER" && <CreateTask />}
      </div>
    </div>
  );
}

export default TasksPage;
