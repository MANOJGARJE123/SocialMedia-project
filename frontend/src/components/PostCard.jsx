import React, { useState, useEffect } from 'react';
import { BsChatFill, BsThreeDotsVertical } from "react-icons/bs";
import { format } from "date-fns";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const PostCard = ({ type, value }) => {
  if (!value?.post?.url) return null;

  const [isLike, setIsLike] = useState(false);
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");

  const { user } = UserData();
  const { likePost, addComment } = PostData();

  const formatDate = format(new Date(value.createdAt), "MMMM do");

  useEffect(() => {
    if (!user?._id) return;
    for (let i = 0; i < value.likes.length; i++) {
      if (value.likes[i] === user._id) {
        setIsLike(true);
        break;
      }
    }
  }, [value, user?._id]);

  const handleLike = () => {
    setIsLike(!isLike);
    likePost?.(value._id);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    addComment(value._id, comment, setComment, setShow);
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center pt-3 pb-14">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {value.owner ? (
            <Link to={`/user/${value.owner._id}`} className="flex items-center space-x-2">
              <img
                src={value.owner?.profilePic?.url || "/default-avatar.png"}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-gray-800 font-semibold">{value.owner?.name}</p>
                <p className="text-gray-500 text-sm">{formatDate}</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center space-x-2">
              <img
                src="/default-avatar.png"
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-gray-800 font-semibold">Deleted User</p>
                <p className="text-gray-500 text-sm">{formatDate}</p>
              </div>
            </div>
          )}

          {user?._id && value?.owner?._id === user._id && (
            <div className="text-gray-500 cursor-pointer">
              <button
                onClick={() => setShow(true)} // You can implement setShowModal logic
                className="hover:bg-gray-50 rounded-full p-1 text-2xl"
              >
                <BsThreeDotsVertical />
              </button>
            </div>
          )}
        </div>

        {/* Caption */}
        <p className='text-gray-800 mb-4'>{value.caption || "No caption"}</p>

        {/* Media */}
        <div className="mb-4">
          {type === "post" ? (
            <img
              src={value.post?.url}
              alt="post"
              className="object-cover rounded-md"
              onError={(e) => (e.target.src = "/default-post.png")}
            />
          ) : (
            <video
              src={value.post?.url}
              className='object-cover rounded-md'
              autoPlay
              controls
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-2">
            <span onClick={handleLike} className="text-2xl cursor-pointer">
              {isLike ? <IoHeartSharp className="text-red-500" /> : <IoHeartOutline />}
            </span>
            <button className="hover:bg-gray-50 rounded-full p-1">
              {value.likes?.length || 0} likes
            </button>
          </div>
          <button
            className='flex items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1'
            onClick={() => setShow(!show)}
          >
            <BsChatFill />
            <span>{value.comments?.length || 0} comments</span>
          </button>
        </div>

        {/* Comment Form */}
        {show && (
          <form className='flex gap-3 mt-2' onSubmit={handleCommentSubmit}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className='custom-input'
              placeholder='Enter comment'
            />
            <button className="bg-gray-100 rounded-lg px-5 py-2" type="submit">
              Add
            </button>
          </form>
        )}

        {/* Comments */}
        <hr className='my-2' />
        <p className='text-gray-800 font-semibold'>Comments</p>
        <hr className='my-2' />
        <div className='mt-4'>
          <div className='comments max-h-[200px] overflow-y-auto'>
            {value.comments?.length > 0 ? (
              value.comments.map((comment) => (
                <Comment key={comment._id} value={comment} />
              ))
            ) : (
              <p>No Comments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

// ✅ Comment Component
export const Comment = ({ value }) => {
  const { user } = UserData();

  const handleDeleteComment = () => {
    // TODO: Hook your deleteComment logic from PostData() here
    console.log("Deleting comment:", value._id);
  };

  return (
    <div className='mt-2 flex items-start justify-between gap-2'>
      <div className='flex gap-2'>
        <img
          src={value?.user?.profilePic?.url || "/default-avatar.png"}
          className='w-6 h-6 rounded-full'
          alt="comment user"
        />
        <div>
          <p className='text-gray-800 font-semibold'>
            {value?.user?.name || "Deleted User"}
          </p>
          <p className='text-gray-500 text-sm'>{value?.comment || ""}</p>
        </div>
      </div>

      {/* ✅ Show delete only if user is owner */}
      {user?._id && value?.user?._id === user._id && (
        <button onClick={handleDeleteComment} className="text-red-500 text-lg">
          <MdDelete />
        </button>
      )}
    </div>
  );
};
