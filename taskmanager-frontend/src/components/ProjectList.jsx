import React, { useEffect, useState } from "react";
import "../styles/ProjectList.css";
import CreateTaskFormForProject from "./CreateTaskFormForProject";
import API from "../api/api";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [role, setRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);

        const res = await API.get("/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProjects(res.data);
      } catch (err) {
        console.error("Error while retrieving project list:", err);
      }
    };

    fetchProjects();
  }, []);

  const handleExpand = async (projectId) => {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/tasks/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, tasks: res.data } : p
        )
      );

      setExpandedProjectId(projectId);
    } catch (err) {
      console.error("Error while retrieving tasks:", err);
    }
  };

  const refreshTasks = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/tasks/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, tasks: res.data } : p
        )
      );
    } catch (err) {
      console.error("Task refresh error:", err);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="project-list">
      <h2>📋 Projects and Tasks</h2>

      <input
        type="text"
        placeholder="🔍 Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {filteredProjects.length === 0 ? (
        <p>No matching projects found.</p>
      ) : (
        filteredProjects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-header" onClick={() => handleExpand(project.id)}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p className="created-by">👤 Created by: {project.createdByUsername}</p>
              <span>
                {expandedProjectId === project.id ? "🔼 Close" : "🔽 Show Tasks"}
              </span>
            </div>

            {expandedProjectId === project.id && (
              <>
                <ul className="task-list">
                  {project.tasks && project.tasks.length > 0 ? (
                    project.tasks.map((task) => (
                      <li key={task.id} className="task-item">
                        <div className="task-info">
                          <strong>{task.title}</strong>
                          <span className={`task-status ${task.status.toLowerCase()}`}>
                            {task.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="assigned-to">
                          👤 Assigned to: {task.assignedTo?.username || "Unassigned"}
                        </div>
                      </li>
                    ))
                  ) : (
                    <li>There are no tasks for this project.</li>
                  )}
                </ul>

                {role === "MANAGER" && (
                  <CreateTaskFormForProject
                    projectId={project.id}
                    onTaskCreated={() => refreshTasks(project.id)}
                  />
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ProjectList;
