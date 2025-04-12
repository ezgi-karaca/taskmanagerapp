import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TaskTable.css";
import { toast } from "react-toastify";
import API from "../api/api";


function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);

      for (const task of res.data) {
        const commentsRes = await API.get(`/comments/task/${task.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments((prev) => ({ ...prev, [task.id]: commentsRes.data }));
      }
    } catch (err) {
      toast.error("Error fetching all tasks.");
    }
  };

  const handleNewCommentChange = (taskId, value) => {
    setNewComments((prev) => ({ ...prev, [taskId]: value }));
  };

  const handleCommentSubmit = async (taskId) => {
    const token = localStorage.getItem("token");
    const commentContent = newComments[taskId];

    if (!commentContent.trim()) return;

    try {
      await API.post(
        `/comments`,
        { taskId, content: commentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewComments((prev) => ({ ...prev, [taskId]: "" }));
      toast.success("Comment added.");
      fetchAllTasks();
    } catch (err) {
      toast.error("Error submitting comment.");
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="task-table-container">
      <h2>📋 All Tasks</h2>

      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Assigned To</th>
            <th>Assigned By</th>
            <th>Comments</th>
            <th>Add Comment</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id} className={`task-row ${task.status.toLowerCase()}`}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status}</td>
              <td>{task.dueDate}</td>
              <td>{task.assignedTo?.username}</td>
              <td><strong>{task.createdByUsername}</strong></td>
              <td>
                {comments[task.id]?.length > 0 ? (
                  <ul className="comment-list">
                    {comments[task.id].map((c) => (
                      <li key={c.id}>
                        <strong>{c.authorUsername}</strong>: {c.content}
                        <div className="comment-date">
                          🕒 {new Date(c.createdAt).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>No comments</span>
                )}
              </td>
              <td>
                <textarea
                  className="comment-input"
                  rows="2"
                  placeholder="Write a comment..."
                  value={newComments[task.id] || ""}
                  onChange={(e) => handleNewCommentChange(task.id, e.target.value)}
                />
                <button onClick={() => handleCommentSubmit(task.id)}>Send</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllTasks;
