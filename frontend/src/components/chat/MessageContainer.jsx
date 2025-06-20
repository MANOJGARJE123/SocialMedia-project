// src/components/chat/MessageContainer.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserData } from "../../context/UserContext";
import { LoadingAnimation } from "../Loading"; // Make sure you have this

const MessageContainer = ({ selectedChat, setChats }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = UserData();

  // 🔁 Fetch messages when chat is selected
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/messages/${selectedChat.users[0]._id}`,
        {
          withCredentials: true,
        }
      );
      setMessages(data); // Set received messages
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  return (
    <div className="p-4 bg-white h-full overflow-y-auto rounded shadow">
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">
            Chat with {selectedChat?.users[0]?.name}
          </h2>

          {/* Message list */}
          <div className="space-y-2">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded w-fit ${
                    msg.sender === user._id
                      ? "ml-auto bg-blue-100"
                      : "mr-auto bg-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
              ))
            ) : (
              <p>No messages yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
