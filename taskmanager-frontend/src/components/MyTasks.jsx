import React, { useEffect, useState } from "react";
import "../styles/TaskTable.css";
import { toast } from "react-toastify";
import API from "../api/api";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState({});
  const [statuses, setStatuses] = useState({});
  const [newComments, setNewComments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/tasks/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(res.data);

      const initialStatuses = {};
      res.data.forEach((task) => {
        initialStatuses[task.id] = task.status;
      });
      setStatuses(initialStatuses);

      for (const task of res.data) {
        const commentsRes = await API.get(
          `/comments/task/${task.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setComments((prev) => ({ ...prev, [task.id]: commentsRes.data }));
      }
    } catch (err) {
      toast.error("Error fetching your tasks.");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setStatuses((prev) => ({ ...prev, [taskId]: newStatus }));

    const token = localStorage.getItem("token");

    try {
      if (newStatus === "COMPLETED") {
        await API.patch(
          `/tasks/${taskId}/complete`,
          newComments[taskId] || "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Task marked as completed");
      } else if (newStatus === "IN_PROGRESS") {
        await API.patch(
          `/tasks/${taskId}/in-progress`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.info("Task marked as in progress");
      }

      fetchMyTasks();
    } catch (err) {
      toast.error("Error updating task status.");
    }
  };

  const handleNewCommentChange = (taskId, value) => {
    setNewComments((prev) => ({ ...prev, [taskId]: value }));
  };

  const handleSubmitComment = async (taskId) => {
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
      fetchMyTasks();
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
      <h2>🗂️ My Tasks</h2>

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
            <th><strong>Assigned By</strong></th>
            <th>Comments</th>
            <th>Add Comment</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id} className={`task-row ${task.status.toLowerCase()}`}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <select
                  value={statuses[task.id]}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </td>
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
                <button onClick={() => handleSubmitComment(task.id)}>Send</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyTasks;
