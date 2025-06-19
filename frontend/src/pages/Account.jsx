import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import PostCard from "../components/PostCard";
import { FaArrowDownLong, FaArrowUp } from "react-icons/fa6";
import Modal from "../components/Modal";
import axios from "axios";
import { Loading } from "../components/Loading";
import { CiEdit } from "react-icons/ci";

const Account = ({ user }) => {
  const navigate = useNavigate();
  const params = useParams();

  const { logoutUser, updateProfilePic, updateProfileName } = UserData();
  const { posts, reels } = PostData();

  const [User, setUser] = useState(user || null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("post");
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingsData, setFollowingsData] = useState([]);
  const [file, setFile] = useState("");

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

  const fetchFollowData = async () => {
    try {
      const { data } = await axios.get("/api/user/followdata/" + User._id);
      setFollowersData(data.followers);
      setFollowingsData(data.followings);
    } catch (error) {
      console.log(error);
    }
  };

  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const changeImageHandler = () => {
    const formdata = new FormData();
    formdata.append("file", file);
    updateProfilePic(user._id, formdata, setFile);
    setFile("");
  };

  useEffect(() => {
    if (!user) fetchUser();
    else setLoading(false);
  }, [params.id, user]);

  useEffect(() => {
    if (User?._id) fetchFollowData();
  }, [User]);

  const logoutHandler = () => {
    logoutUser(navigate);
  };

  const myPosts = posts?.filter((post) => post.owner?._id === User._id) || [];
  const myReels = reels?.filter((reel) => reel.owner?._id === User._id) || [];

  const prevReel = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };

  const nextReel = () => {
    if (index < myReels.length - 1) setIndex((prev) => prev + 1);
  };

  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const UpdateName = () => {
    updateProfileName(user._id, name, setShowInput);

    // ✅ Update UI instantly
    setUser((prevUser) => ({
      ...prevUser,
      name: name,
    }));

    // Optional: Add toast
    // toast.success("Name updated successfully!");
  };

  if (loading || !User) return <Loading />;

  return (
    <>
      {show && <Modal value={followersData} title="Followers" setShow={setShow} />}
      {show1 && <Modal value={followingsData} title="Followings" setShow={setShow1} />}

      <div className="bg-gray-100 min-h-screen flex flex-col gap-4 items-center justify-center pt-3 pb-14">
        {/* User Info */}
        <div className="bg-white flex justify-between gap-4 p-8 rounded-lg shadow-md max-w-md">
          <div className="image flex flex-col justify-between mb-4 gap-4">
            <img
              src={User.profilePic?.url || "/default-avatar.png"}
              alt="Profile"
              className="w-[180px] h-[180px] rounded-full"
            />

            <div className="update w-[250px] flex flex-col justify-center items-center gap-2">
              <input
                type="file"
                id="profileUpload"
                className="hidden"
                accept="image/*"
                onChange={changeFileHandler}
              />
              <label
                htmlFor="profileUpload"
                className="cursor-pointer border border-gray-400 px-4 py-2 rounded-md bg-white shadow hover:bg-gray-100 transition"
              >
                Choose File
              </label>
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                onClick={changeImageHandler}
                disabled={!file}
              >
                Update Profile
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {showInput ? (
              <div className="flex justify-center items-center gap-2">
                <input
                  className="custom-input"
                  style={{ width: "80px" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                  required
                />
                <button onClick={UpdateName}>Update</button>
                <button
                  className="bg-red-400 text-white p-2 rounded-full"
                  onClick={() => setShowInput(false)}
                >
                  X
                </button>
              </div>
            ) : (
              <p className="text-gray-800 font-semibold">
                {User.name}{" "}
                <button onClick={() => setShowInput(true)} className="text-sm text-blue-500">
                  <CiEdit />
                </button>
              </p>
            )}
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

        {/* Post/Reel Buttons */}
        <div className="controls flex justify-center items-center bg-white p-4 rounded-md gap-7">
          <button
            onClick={() => setType("post")}
            className={type === "post" ? "font-bold underline" : ""}
          >
            Posts
          </button>
          <button
            onClick={() => setType("reel")}
            className={type === "reel" ? "font-bold underline" : ""}
          >
            Reels
          </button>
        </div>

        {/* Posts */}
        {type === "post" &&
          (myPosts.length > 0 ? (
            myPosts.map((post) => (
              <PostCard type="post" value={post} key={post._id} />
            ))
          ) : (
            <p>No post yet</p>
          ))}

        {/* Reels */}
        {type === "reel" &&
          (myReels.length > 0 ? (
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
          ))}
      </div>
    </>
  );
};

export default Account;
