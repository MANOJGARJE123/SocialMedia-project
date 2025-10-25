import axios from "axios";
import React, { useState, useEffect } from "react";
import { BsChatFill, BsThreeDotsVertical } from "react-icons/bs";
import { format } from "date-fns";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import SimpleModal from "./SimpleModal";
import { LoadingAnimation } from "./Loading";

const PostCard = ({ type, value }) => {
  if (!value?.post?.url) return null;

  const [isLike, setIsLike] = useState(false);
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [caption, setCaption] = useState(value.caption || "");
  const [captionLoading, setCaptionLoading] = useState(false);

  const { user } = UserData();
  const { likePost, addComment, deletePost, fetchPosts } = PostData();

  const formatDate = format(new Date(value.createdAt), "MMMM do");

  useEffect(() => {
    if (!user?._id) return;
    setIsLike(value.likes.includes(user._id));
  }, [value.likes, user?._id]);

  const handleLike = () => {
    setIsLike(!isLike);
    likePost?.(value._id);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    addComment(value._id, comment, setComment, setShow);
  };

  const deleteHandler = () => {
    setLoading(true);
    deletePost(value._id).finally(() => setLoading(false));
  };

  const editHandler = () => {
    setShowModal(false);
    setShowInput(true);
  };

  const updateCaption = async () => {
    setCaptionLoading(true);
    try {
      const { data } = await axios.put(`/api/post/${value._id}`, { caption });
      toast.success(data.message);
      fetchPosts();
      setShowInput(false);
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setCaptionLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center pt-3 pb-14">
      <SimpleModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="flex flex-col items-center justify-center gap-3">
          <button onClick={editHandler} className="bg-blue-400 text-black py-1 px-3 rounded-md">
            Edit
          </button>
          <button
            onClick={deleteHandler}
            className="bg-red-400 text-black py-1 px-3 rounded-md"
            disabled={loading}
          >
            {loading ? <LoadingAnimation /> : "Delete"}
          </button>
        </div>
      </SimpleModal>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
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
              <img src="/default-avatar.png" alt="profile" className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-gray-800 font-semibold">Deleted User</p>
                <p className="text-gray-500 text-sm">{formatDate}</p>
              </div>
            </div>
          )}

          {user?._id && value?.owner?._id === user._id && (
            <div className="text-gray-500 cursor-pointer">
              <button
                onClick={() => setShowModal(true)}
                className="hover:bg-gray-50 rounded-full p-1 text-2xl"
              >
                <BsThreeDotsVertical />
              </button>
            </div>
          )}
        </div>

        <div className="mb-4">
          {showInput ? (
            <>
              <input
                className="custom-input"
                style={{ width: "150px" }}
                type="text"
                placeholder="Enter Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <button
                onClick={updateCaption}
                className="text-sm bg-blue-500 text-white px-1 py-1 rounded-md"
                disabled={captionLoading}
              >
                {captionLoading ? <LoadingAnimation /> : "Update Caption"}
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="text-sm bg-red-500 text-white px-1 py-1 rounded-md"
              >
                X
              </button>
            </>
          ) : (
            <p className="text-gray-800">{value.caption}</p>
          )}
        </div>

        <div className="mb-4">
          {type === "post" ? (
            <img
              src={value.post?.url}
              alt="post"
              className="object-cover rounded-md"
              onError={(e) => (e.target.src = "/default-post.png")}
            />
          ) : (
            <video src={value.post?.url} className="object-cover rounded-md" autoPlay controls />
          )}
        </div>

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
            className="flex items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1"
            onClick={() => setShow(!show)}
          >
            <BsChatFill />
            <span>{value.comments?.length || 0} comments</span>
          </button>
        </div>

        {show && (
          <form className="flex gap-3 mt-2" onSubmit={handleCommentSubmit}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="custom-input"
              placeholder="Enter comment"
            />
            <button className="bg-gray-100 rounded-lg px-5 py-2" type="submit">
              Add
            </button>
          </form>
        )}

        <hr className="my-2" />
        <p className="text-gray-800 font-semibold">Comments</p>
        <hr className="my-2" />
        <div className="mt-4">
          <div className="comments max-h-[200px] overflow-y-auto">
            {value.comments && value.comments?.length > 0 ? (
              value.comments.map((comment) => <Comment key={comment._id} value={comment} user={user} owner={value.owner._id} id={value._id} />)
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

export const Comment = ({ value,user,owner,id }) => {
  const { deleteComment } = PostData();
  
  const deleteCommentHandler = () => {
    deleteComment(id, value._id);
  };

  return (
    <div className="mt-2 flex items-start justify-between gap-2">
      <div className="flex gap-2">
        <img
          src={value?.user?.profilePic?.url || "/default-avatar.png"}
          className="w-6 h-6 rounded-full"
          alt="comment user"
        />
        <div>
          <p className="text-gray-800 font-semibold">{value?.user?.name || "Deleted User"}</p>
          <p className="text-gray-500 text-sm">{value?.comment || ""}</p>
        </div>
      </div>

      {owner === user._id ? (
        ""
      ) : (
        <>
          {value.user._id === user._id && (
            <button onClick={deleteCommentHandler} className="text-red-500">
              <MdDelete />
            </button>
          )}
        </>
      )}
      
      {owner === user._id && (
        <button onClick={deleteCommentHandler} className="text-red-500">
          <MdDelete />
        </button>
      )}
    </div>
  );
};

























// PostCard is a reusable component to display posts or reels. 
// It shows owner info, media, caption, likes, and comments.
//  Users can like posts, add comments, and delete their own posts. 
// The post owner can also edit the caption. The component uses local state for likes, 
// comments, modal visibility, and caption editing. It also integrates with PostContext for
//  performing actions like liking, deleting, and fetching posts.