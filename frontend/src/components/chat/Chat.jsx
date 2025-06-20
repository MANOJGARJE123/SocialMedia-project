import React from "react";
import { UserData } from "../../context/UserContext";
import { BsSendCheck } from "react-icons/bs";

const Chat = ({ chat, setSelectedChat, isOnline }) => {
  const { user: loggedInUser } = UserData();
  const user = chat?.users.find(u => u._id !== loggedInUser._id);
  return (
    <div>
      {user && (
        <div
          className="bg-gray-200 py-2 px-1 rounded-md cursor-pointer mt-3"
          onClick={() => setSelectedChat(chat)}
        >
          <div className="flex justify-center items-center gap-2">
            {isOnline && (
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm border border-white">.</div>
            )}

            <img
              src={
                user.profilePic?.url ||
                "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)
              }
              onError={(e) => {
                e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name);
              }}
              className="w-8 h-8 rounded-full"
              alt="Profile"
            />

            <span>{user.name}</span>
          </div>

          <span className="flex justify-center items-center gap-1">
            {loggedInUser._id === chat.latestMessage.sender ? (
              <BsSendCheck />
            ) : (
              ""
            )}
            {chat.latestMessage.text.slice(0, 18)}...
          </span>
        </div>
      )}
    </div>
  );
};

export default Chat;