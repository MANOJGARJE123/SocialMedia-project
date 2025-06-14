import React from 'react';
import { BsChatFill, BsThreeDotsVertical } from "react-icons/bs";
import { format } from "date-fns";

const PostCard = () => {
  // Dummy data for testing
  const value = {
    owner: {
      name: "Manoj Garje",
      profilePic: {
        url: "https://via.placeholder.com/40"
      }
    },
    createdAt: new Date().toISOString()
  };

  const formatDate = format(new Date(value.createdAt), "MMMM d, yyyy");

  return (
    <div className="bg-gray-100 flex items-center justify-center pt-3 pb-14">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img src={value.owner.profilePic.url} alt="profile" className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-gray-800 font-semibold">{value.owner.name}</p>
              <p className="text-gray-500 text-sm">{formatDate}</p>
            </div>
          </div>
          <button className="hover:bg-gray-50 rounded-full p-1 text-2xl text-gray-500">
            <BsThreeDotsVertical />
          </button>
        </div>
      </div>
      <div className='mb-4'>
        <p className='text-gray-800'>hii my first post</p>
      </div>

      <div className="mb-4">
         
      </div>

    </div>
  );
};

export default PostCard;
