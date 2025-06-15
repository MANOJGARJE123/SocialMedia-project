import React, { useState } from "react";
import AddPost from "../components/AddPost";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowUp, FaArrowDownLong } from "react-icons/fa6";

const Reels = () => {
  const { reels } = PostData();
  const [index, setIndex] = useState(0);

  const prevReel = () => {
    if (index === 0) return;
    setIndex(index - 1);
  };

  const nextReel = () => {
    if (index === reels.length - 1) return;
    setIndex(index + 1);
  };

  return (
    <div>
      <AddPost type="reel" />

      <div className="flex gap-3 w-[90%] max-w-[600px] mx-auto mt-4 items-center">
        {reels && reels.length > 0 ? (
          <PostCard key={reels[index]?._id} value={reels[index]} type="reel" />
        ) : (
          <p className="text-center text-gray-500 mt-4">No reels yet</p>
        )}

        <div className="flex flex-col items-center gap-4">
          {index !== 0 && (
            <button
              onClick={prevReel}
              className="bg-gray-500 text-white py-3 px-3 rounded-full"
            >
              <FaArrowUp />
            </button>
          )}
          {reels && index !== reels.length - 1 && (
            <button
              onClick={nextReel}
              className="bg-gray-500 text-white py-3 px-4 rounded-full"
            >
              <FaArrowDownLong />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reels;
