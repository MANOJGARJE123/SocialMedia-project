import React, { useEffect, useState } from "react";
import { ChatData } from "../context/ChatContext";
import { UserData } from "../context/UserContext";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import Chat from "../components/chat/Chat";
import MessageContainer from "../components/chat/MessageContainer";
import { SocketData } from "../context/SocketContext";

const ChatPage = () => {
  const { createChat, selectedChat, setSelectedChat, chats, setChats } = ChatData();
  const { user } = UserData();
  const { onlineUsers, socket } = SocketData();

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");//search text type
  const [search, setSearch] = useState(false);

  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.get("/api/user/all?search=" + query, { //fetch the search user 
        withCredentials: true,
      });
      setUsers(data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const getAllChats = async () => {
    try {
      const { data } = await axios.get("/api/messages/chats", {
        withCredentials: true,
      });
      setChats(data);
    } catch (error) {
      console.log("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [query]);

  useEffect(() => {
    getAllChats();
  }, []);

  const createNewChat = async (id) => {
    await createChat(id);
    setSearch(false);
    getAllChats();
  };

  return (
    <div className="w-full md:w-[750px] md:p-4">
      <div className="flex gap-4 mx-auto">
        <div className="w-[30%]">
          <div className="top">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded-full"
              onClick={() => setSearch(!search)}
            >
              {search ? "X" : <FaSearch />}
            </button>

            {search ? (
              <>
                <input
                  type="text"
                  className="custom-input w-full border border-gray-300 mt-2 px-2 py-1 rounded"
                  placeholder="Enter name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

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
              <div className="flex flex-col justify-center items-center mt-2">
                {chats.map((chat) => {
                  const otherUser = chat.users.find((u) => u._id !== user._id);
                  const isOnline = onlineUsers.includes(otherUser?._id);
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

        {selectedChat === null ? (
          <div className="w-[70%] mx-20 mt-40 text-2xl">
            Hello 👋 {user.name}, select a chat to start conversation
          </div>
        ) : (
          <div className="w-[70%]">
            <MessageContainer selectedChat={selectedChat} setChats={setChats} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
