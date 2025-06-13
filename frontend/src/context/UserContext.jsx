import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Changed [] to null for better consistency
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

   async function registerUser(formdata, navigate) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", formdata);
      toast.success(data.message);
      setIsAuth(true);
      setUser(data.user);
      navigate("/");
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
       setLoading(false);
    }
  }

  async function loginUser(email, password, navigate) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      toast.success(data.message);
      setIsAuth(true);
      setUser(data.user);
      navigate("/");
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      setLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/me");
      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  async function logoutUser(navigate) {
    try {
      await axios.get("/api/auth/logout");
      setIsAuth(false);
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ loginUser, logoutUser, isAuth, setIsAuth, user, setUser, loading ,registerUser,}}>
      {children}
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);

export default UserContextProvider;
