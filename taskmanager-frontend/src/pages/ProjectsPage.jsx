import React, { useState } from "react";
import CreateProjectForm from "../components/CreateProjectForm";
import ProjectList from "../components/ProjectList";
import "../styles/ProjectsPage.css";

function ProjectsPage({ role }) {
  const [activeSection, setActiveSection] = useState("create");

  return (
    <div className="projects-layout">
      <aside className="sidebar">
      {role === "MANAGER" && (
          <button onClick={() => setActiveSection("create")}>➕ Create Project</button>
        )}
        <button onClick={() => setActiveSection("list")}>📂 Projects</button>
      </aside>

      <div className="content">
      {activeSection === "create" && role === "MANAGER" && <CreateProjectForm />}
      {activeSection === "list" && <ProjectList />}
      </div>
    </div>
  );
}

export default ProjectsPage;
