import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CommentSection.css";

function CommentSection({ taskId }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/comments/task/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/comments",
        {
          taskId: taskId,
          content: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCommentText("");
      fetchComments();
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  return (
    <div className="comment-section">
      <h4>💬 Comments</h4>
      {comments.length === 0 ? (
        <p className="no-comment">No comments yet.</p>
      ) : (
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id}>
              <strong>{c.author}</strong>: {c.content}
              <br />
              <span className="timestamp">{new Date(c.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}

      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
      />
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
  );
}

export default CommentSection;
