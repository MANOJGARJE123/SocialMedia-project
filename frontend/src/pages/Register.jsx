  import React, { useState } from 'react';
  import { Link } from 'react-router-dom';
  import { UserData } from '../context/UserContext';
  import { useNavigate } from 'react-router-dom';


  const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [file, setFile] = useState("");
    const [filePrev, setFilePrev] = useState("");

    const {registerUser,loading} = UserData();

    const changeFileHandler = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setFilePrev(reader.result);
        setFile(file);
      };
    };

    const navigate = useNavigate();


    const submitHandler = (e) => {
      e.preventDefault();
      
      const formdata = new FormData();

      formdata.append("name", name);
      formdata.append("email", email);
      formdata.append("password", password);
      formdata.append("gender", gender);
      formdata.append("file", file);

      registerUser(formdata, navigate);
    };

    return (
      <>
      {
        loading?<h1>Loading...</h1>:
        <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-[90%] md:w-[60%] flex shadow-lg rounded-2xl border border-gray-300 bg-white overflow-hidden">
          
          {/* Left side: Form */}
          <div className="w-full md:w-2/3 p-6">
            <div className="text-center mb-6">
              <h1 className="font-semibold text-2xl md:text-3xl text-gray-700">Register to Social Media</h1>
            </div>

            <form onSubmit={submitHandler}>   
              <div className="flex flex-col justify-center items-center m-2 space-y-6 md:space-y-8">
                {filePrev && (
                  <img
                    src={filePrev}
                    className="w-[180px] h-[180px] rounded-full"
                    alt="Profile Preview"
                  />
                )}
                <input
                  type="file"
                  className="custom-input"
                  onChange={changeFileHandler}
                  accept="image/*"
                  required
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="custom-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
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

                <select
                  className="custom-input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>

                <button type="submit" className="auth-btn">Register</button>
              </div>
            </form>
          </div>

          {/* Right side: Info Panel */}
          <div className="hidden md:flex w-1/3 bg-gradient-to-l from-blue-400 to-yellow-400 text-white flex-col justify-center items-center p-6 space-y-4">
            <h1 className="text-3xl font-bold">Have an Account?</h1>
            <p className="text-sm">Login to Social Media</p>
            <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
              Login
            </Link>
          </div>
        </div>
      </div>
      }
      </>
    );
  };

  export default Register;
