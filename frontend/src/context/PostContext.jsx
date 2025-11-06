import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loading } from "../components/Loading";

const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);

  async function fetchPosts() {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/post/all");
      setPosts(data.posts);
      setReels(data.reels);
    } catch (error) {
      console.error("Fetch posts error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addPost(formdata, setFile, setFilePrev, setCaption, type) {
    setAddLoading(true);
    try {
      const { data } = await axios.post("/api/post/new?type=" + type, formdata);
      toast.success(data.message);
      fetchPosts();
      setFile("");
      setFilePrev("");
      setCaption("");
    } catch (error) {
      if (error?.response?.status === 403) {
        toast.error("Your image cannot be uploaded because it may contain inappropriate content.");
      } else {
        toast.error(error?.response?.data?.message || "Failed to add post");
      }
    } finally {
      setAddLoading(false);
    }
  }

  async function likePost(id) {
    try {
      const { data } = await axios.post(`/api/post/like/${id}`);
      toast.success(data.message);
      fetchPosts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to like post");
    }
  }

  async function addComment(id, comment, setComment, setShow) {
    try {
      const { data } = await axios.post(`/api/post/comment/${id}`, { comment });
      toast.success(data.message);
      fetchPosts();
      setComment("");
      setShow(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add comment");
    }
  }

  async function deleteComment(id, commentId) {
    try {
      const { data } = await axios.delete(
        `/api/post/comment/${id}?commentId=${commentId}`
      );
      toast.success(data.message);
      fetchPosts();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function deletePost(id) {
    setLoading(true);
    try {
      const { data } = await axios.delete(`/api/post/${id}`);
      toast.success(data.message);
      fetchPosts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete post");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider
      value={{
        reels,
        posts,
        loading,
        addPost,
        likePost,
        addComment,
        deleteComment,
        deletePost,
        fetchPosts,
        Loading,
        addLoading
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const PostData = () => useContext(PostContext);
