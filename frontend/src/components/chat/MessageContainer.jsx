// src/components/chat/MessageContainer.jsx

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { UserData } from "../../context/UserContext";
import { LoadingAnimation } from "../Loading";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { SocketData } from "../../context/SocketContext";

const MessageContainer = ({ selectedChat, setChats }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = UserData();
  const { socket } = SocketData();

     useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedChat._id === message.chatId) {
        setMessages((prev) => [...prev, message]);
      }

      setChats((prev) => {
        const updatedChat = prev.map((chat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              latestMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return chat;
        });
        return updatedChat;
      });
    });

    return () => socket.off("newMessage");
  }, [socket, selectedChat, setChats]);
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

  // Scroll to bottom when messages change
  const messageContainerRef = useRef(null);
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  return (
    <div className="p-4 bg-white h-[500px] overflow-y-auto rounded shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 border-b pb-2">
        <img
          src={selectedChat.users[0].profilePic?.url}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <h2 className="text-lg font-semibold">{selectedChat.users[0].name}</h2>
      </div>

      {/* Loading spinner or Messages */}
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
        <div ref={messageContainerRef}   className="flex flex-col gap-4 my-4 h-[400px] overflow-y-auto border border-gray-300 bg-gray-100 p-3">
           {messages &&
                messages.map((e, index) => (
                    <Message
                    key={e._id || index} // ✅ Add unique key here
                    message={e.text}
                    ownMessage={e.sender === user._id}
                    />
                ))}
        </div>

        <MessageInput
            setMessages={setMessages}
            selectedChat={selectedChat}
            />
        </>
      )}
    </div>
  );
};

export default MessageContainer;
