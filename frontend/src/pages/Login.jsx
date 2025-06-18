import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../context/UserContext'; // adjust path if needed
import { PostData } from '../context/PostContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { loginUser , loading} = UserData();
  const {fetchPosts} = PostData()

  const submitHandler = (e) => {
  e.preventDefault();
  console.log("🔑 submitHandler fired:", { email, password });
  loginUser(email, password, navigate,fetchPosts);
};

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[90%] md:w-[60%] flex shadow-lg rounded-2xl border border-gray-300 bg-white overflow-hidden">
        
        {/* Left side: Form */}
        <div className="w-full md:w-2/3 p-6">
          <div className="text-center mb-6">
            <h1 className="font-semibold text-2xl md:text-3xl text-gray-700">
              Login to Social Media
            </h1>
          </div>

          <form onSubmit={submitHandler}>   
            <div className="flex flex-col items-center space-y-6">
              <input
                type="email"
                placeholder="Email"
                className="custom-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="custom-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="auth-btn mt-4 px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Login
              </button>
            </div>
          </form>
        </div>

        {/* Right side: Info panel */}
        <div className="hidden md:flex w-1/3 bg-gradient-to-l from-blue-400 to-yellow-400 text-white flex-col justify-center items-center p-6 space-y-4">
          <h1 className="text-3xl font-bold">Don't have an Account?</h1>
          <p className="text-sm">Register to Social Media</p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
