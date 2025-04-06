import React, { useState } from "react";
import MyTasks from "../components/MyTasks";
import AllTasks from "../components/AllTasks";
import "../styles/TasksPage.css";

function TasksPage({ role }) {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="tasks-page">
      <div className="tasks-tabs">
        
        {(
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            📋 All Tasks
          </button>
        )}

<button
          className={activeTab === "my" ? "active" : ""}
          onClick={() => setActiveTab("my")}
        >
          🧑‍💻 My Tasks
        </button>
      </div>

      <div className="tasks-content">
        {activeTab === "all" && <AllTasks />}
        {activeTab === "my" && <MyTasks />}
        
      </div>
    </div>
  );
}

export default TasksPage;
