import React from "react";
import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard"; // ✅ Import this!
import { PostData } from "../context/PostContext";

const Home = () => {
  return (
    <div>
      <AddPost />
      <PostCard />
    </div>
  );
};

export default Home;
