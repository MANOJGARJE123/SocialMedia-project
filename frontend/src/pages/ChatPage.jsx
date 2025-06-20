import React, { useEffect, useState } from "react";
import { ChatData } from "../context/ChatContext"; // Global chat state (chats, selectedChat, etc.)
import { UserData } from "../context/UserContext"; // Global user state (user info, online users)
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import Chat from "../components/chat/Chat"; // Single chat UI card
import MessageContainer from "../components/chat/MessageContainer"; // Actual message box (chat area)

const ChatPage = () => {
  // Context states
  const { createChat, selectedChat, setSelectedChat, chats, setChats } = ChatData();
  const { user, onlineUsers = [] } = UserData(); // Get logged-in user and list of online users

  // Local states
  const [users, setUsers] = useState([]);        // List of searched users
  const [query, setQuery] = useState("");        // Search query string
  const [search, setSearch] = useState(false);   // Toggle for showing search input

  // 🔍 Fetch users based on search input
  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.get("/api/user/all?search=" + query, {
        withCredentials: true,
      });
      setUsers(data); // Set the users to display in search result
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  // 📥 Fetch all chats of the logged-in user
  const getAllChats = async () => {
    try {
      const { data } = await axios.get("/api/messages/chats", {
        withCredentials: true,
      });
      setChats(data); // Set all fetched chats into context
    } catch (error) {
      console.log("Error fetching chats:", error);
    }
  };

  // 🕵️‍♂️ Trigger search API on every query change
  useEffect(() => {
    fetchAllUsers();
  }, [query]);

  // 🚀 Load chats on first page load
  useEffect(() => {
    getAllChats();
  }, []);

  // ➕ Create a new chat when user is clicked from search
  const createNewChat = async (id) => {
    await createChat(id); // API to create chat
    setSearch(false);     // Close search panel
    getAllChats();        // Refresh chat list
  };

  return (
    <div className="w-full md:w-[750px] md:p-4">
      <div className="flex gap-4 mx-auto">
        {/* Left Panel - User Search + Chat List */}
        <div className="w-[30%]">
          <div className="top">
            {/* 🔍 Toggle Search Button */}
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded-full"
              onClick={() => setSearch(!search)}
            >
              {search ? "X" : <FaSearch />}
            </button>

            {search ? (
              <>
                {/* 🔎 Search Input */}
                <input
                  type="text"
                  className="custom-input w-full border border-gray-300 mt-2 px-2 py-1 rounded"
                  placeholder="Enter name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                {/* 👤 Show searched users */}
                <div className="users mt-2">
                  {users.length > 0 ? (
                    users.map((e) => (
                      <div
                        key={e._id}
                        onClick={() => createNewChat(e._id)}
                        className="bg-gray-500 text-white p-2 mt-2 cursor-pointer flex items-center gap-2 rounded"
                      >
                        <img
                          src={
                            e.profilePic?.url ||
                            "https://ui-avatars.com/api/?name=" + encodeURIComponent(e.name)
                          }
                          className="w-8 h-8 rounded-full"
                          alt="Profile"
                        />
                        {e.name}
                      </div>
                    ))
                  ) : (
                    <p>No Users</p>
                  )}
                </div>
              </>
            ) : (
              // 💬 Show chat list (not search)
              <div className="flex flex-col justify-center items-center mt-2">
                {chats.map((chat) => {
                  // Get the other person in the chat
                  const otherUser = chat.users.find((u) => u._id !== user._id);
                  // ✅ Check if that person is online
                  const isOnline = otherUser && onlineUsers.includes(otherUser._id);

                  return (
                    <Chat
                      key={chat._id}
                      chat={chat}
                      setSelectedChat={setSelectedChat}
                      isOnline={isOnline}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Message Container */}
        {selectedChat === null ? (
          // 👋 Welcome message if no chat is selected
          <div className="w-[70%] mx-20 mt-40 text-2xl">
            Hello 👋 {user.name}, select a chat to start conversation
          </div>
        ) : (
          // 💬 Show selected chat messages
          <div className="w-[70%]">
            <MessageContainer selectedChat={selectedChat} setChats={setChats} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
