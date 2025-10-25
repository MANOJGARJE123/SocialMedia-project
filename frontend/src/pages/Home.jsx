import React from "react";
import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
import { PostData } from "../context/PostContext";

const Home = () => {
  const { posts, loading } = PostData(); //Accesses all posts and a loading state from the PostContext.

  return (
    <div>
      <AddPost type="post" />

      {loading ? (
        <p>Loading...</p>
      ) : posts && posts.length > 0 ? (
        posts.map((e) => <PostCard value={e} key={e._id} type="post" />)
      ) : (
        <p>No Post Yet</p>
      )}
    </div>
  );
};

export default Home;