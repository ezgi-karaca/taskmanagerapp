import React, { useState } from "react";
import "../styles/CreateProjectForm.css";
import API from "../api/api";

function CreateProjectForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [success, setSuccess] = useState(false);

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

      await API.post("/projects", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(true);
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Proje oluşturulurken hata:", error);
      alert("Proje oluşturulamadı.");
    }
  };

  return (
    <div className="create-project-form">
      <h2>➕ Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
        <button type="submit">Proje Oluştur</button>
      </form>

      {success && <p className="success-message">✅ Proje başarıyla oluşturuldu!</p>}
    </div>
  );
}

export default CreateProjectForm;
