import React, { useEffect, useState } from "react";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowUp, FaArrowDownLong } from "react-icons/fa6";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UserAccount = ({ user: loggedInUser }) => {
  const navigate = useNavigate();
  const { posts, reels } = PostData();
  const [user, setUser] = useState([]);
   const params = useParams();

  if (!user) return null;

   async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/" + params.id);

      setUser(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

    useEffect(() => {
    fetchUser();
  }, [params.id]);


  const myPosts = posts?.filter((post) => post.owner?._id === user._id) || [];
  const myReels = reels?.filter((reel) => reel.owner?._id === user._id) || [];

  const [type, setType] = useState("post");

    const [index, setIndex] = useState(0);
  
    const prevReel = () => {
      if (index === 0) {
        console.log("null");
        return null;
      }
      setIndex(index - 1);
    };
    const nextReel = () => {
      if (index === reels.length - 1) {
        console.log("null");
        return null;
      }
      setIndex(index + 1);
    };

  return (
    <>
      {user && (
        <>
          <div className="bg-gray-100 min-h-screen flex flex-col gap-4 items-center justify-center pt-3 pb-14">
            <div className="bg-white flex justify-between gap-4 p-8 rounded-lg shadow-md max-w-md">
              <div className="image flex flex-col justify-between mb-4 gap-4">
                <img
                  src={user.profilePic?.url || "/default-avatar.png"}
                  alt="Profile"
                  className="w-[180px] h-[180px] rounded-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-gray-800 font-semibold">{user.name}</p>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <p className="text-gray-500 text-sm capitalize">{user.gender}</p>
                <p className="text-gray-500 text-sm">
                  {user.followers?.length || 0} follower
                </p>
                <p className="text-gray-500 text-sm">
                  {user.followings?.length || 0} following
                </p>
              </div>
            </div>

            <div className="controls flex justify-center items-center bg-white p-4 rounded-md gap-7">
              <button onClick={() => setType("post")}>Posts</button>
              <button onClick={() => setType("reel")}>Reels</button>
            </div>

            {/* POSTS */}
            {type === "post" && (
              <>
                {myPosts && myPosts.length > 0 ? (
                  myPosts.map((e) => (
                    <PostCard type={"post"} value={e} key={e._id} />
                  ))
                ) : (
                  <p>No post yet</p>
                )}
              </>
            )}

            {/* REELS */}
            {type === "reel" && (
              <>
                {myReels && myReels.length > 0 ? (
                <div className="flex justify-center items-center gap-4">
                  {index > 0 && (
                    <button
                      className="bg-gray-500 text-white py-5 px-5 rounded-full"
                      onClick={prevReel}
                    >
                      <FaArrowUp />
                    </button>
                  )}

                  <PostCard type={"reel"} value={myReels[index]} key={myReels[index]._id} />

                  {index < myReels.length - 1 && (
                    <button
                      className="bg-gray-500 text-white py-5 px-5 rounded-full"
                      onClick={nextReel}
                    >
                      <FaArrowDownLong />
                    </button>
                  )}
                </div>
              ) : (
                <p>No Reel yet</p>
              )}

                
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default UserAccount;
