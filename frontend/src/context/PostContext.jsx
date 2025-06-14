import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

const PostContext = createContext();


export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    try {
      const { data } = await axios.get("/api/post/all");

      setPosts(data.posts);
      setReels(data.reels);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

    useEffect(() => {
    fetchPosts();
    }, []);

     return ( <PostContext.Provider value={{ reels,posts }} > {children} </PostContext.Provider>
  );
};

export const PostData = () => useContext(PostContext);