import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import "../styles/NotificationPopup.css";

function NotificationPopup() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchOldNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:8080/api/notifications/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchOldNotifications();

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe("/topic/notifications", (message) => {
          const body = JSON.parse(message.body);
          setNotifications((prev) => [body, ...prev]);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <div className="popup-content">
      <h4>🔔 Notifications</h4>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((n, index) => (
            <li key={index}>
              <strong>{n.title}</strong>: {n.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationPopup;
