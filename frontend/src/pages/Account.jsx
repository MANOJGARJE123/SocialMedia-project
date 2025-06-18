import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";
import Modal from "../components/Modal";
import axios from "axios";
import { Loading } from "../components/Loading";

const Account = ({ user }) => {
  const navigate = useNavigate();
  const params = useParams();
  const { logoutUser } = UserData();
  const { posts, reels } = PostData();

  const [User, setUser] = useState(user || null);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState("post");
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);

  // ✅ Fetch user info if not passed via props
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/" + params.id);
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch follower/following data
  const fetchFollowData = async () => {
    try {
      const { data } = await axios.get("/api/user/followdata/" + User._id);
      setFollowersData(data.followers);
      setFollowingsData(data.followings);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Fetch user only on mount or when `params.id` changes
  useEffect(() => {
    if (!user) fetchUser();
    else setLoading(false); // If passed via props
  }, [params.id, user]);

  // ✅ Fetch follow data after User is set
  useEffect(() => {
    if (User?._id) fetchFollowData();
  }, [User]);

  const logoutHandler = () => {
    logoutUser(navigate);
  };

  const prevReel = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };

  const nextReel = () => {
    if (index < myReels.length - 1) setIndex((prev) => prev + 1);
  };

  if (loading || !User) return <Loading />;

  const myPosts = posts?.filter((post) => post.owner?._id === User._id) || [];
  const myReels = reels?.filter((reel) => reel.owner?._id === User._id) || [];

  return (
    <>
      {show && (
        <Modal value={followersData} title="Followers" setShow={setShow} />
      )}
      {show1 && (
        <Modal value={followingsData} title="Followings" setShow={setShow1} />
      )}

      <div className="bg-gray-100 min-h-screen flex flex-col gap-4 items-center justify-center pt-3 pb-14">
        {/* User Info Card */}
        <div className="bg-white flex justify-between gap-4 p-8 rounded-lg shadow-md max-w-md">
          <div className="image flex flex-col justify-between mb-4 gap-4">
            <img
              src={User.profilePic?.url || "/default-avatar.png"}
              alt="Profile"
              className="w-[180px] h-[180px] rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-800 font-semibold">{User.name}</p>
            <p className="text-gray-500 text-sm">{User.email}</p>
            <p className="text-gray-500 text-sm capitalize">{User.gender}</p>
            <p
              className="text-gray-500 text-sm cursor-pointer"
              onClick={() => setShow(true)}
            >
              {User.followers?.length || 0} follower
            </p>
            <p
              className="text-gray-500 text-sm cursor-pointer"
              onClick={() => setShow1(true)}
            >
              {User.followings?.length || 0} following
            </p>
            <button
              onClick={logoutHandler}
              className="bg-red-500 text-white px-4 py-1 rounded-md mt-2"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Post / Reel Toggle Buttons */}
        <div className="controls flex justify-center items-center bg-white p-4 rounded-md gap-7">
          <button onClick={() => setType("post")}>Posts</button>
          <button onClick={() => setType("reel")}>Reels</button>
        </div>

        {/* Posts Section */}
        {type === "post" && (
          <>
            {myPosts.length > 0 ? (
              myPosts.map((post) => (
                <PostCard type="post" value={post} key={post._id} />
              ))
            ) : (
              <p>No post yet</p>
            )}
          </>
        )}

        {/* Reels Section */}
        {type === "reel" && (
          <>
            {myReels.length > 0 ? (
              <div className="flex justify-center items-center gap-4">
                {index > 0 && (
                  <button
                    className="bg-gray-500 text-white py-5 px-5 rounded-full"
                    onClick={prevReel}
                  >
                    <FaArrowUp />
                  </button>
                )}

                <PostCard
                  type="reel"
                  value={myReels[index]}
                  key={myReels[index]._id}
                />

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
  );
};

export default Account;
