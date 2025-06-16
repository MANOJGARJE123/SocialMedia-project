import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserData } from "./context/UserContext";
// Pages & Components
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Reels from "./pages/Reels";
import NavigationBar from "./components/NavigationBar";
import NotFound from "./components/NotFound";
import { Loading } from "./components/Loading";

const App = () => {
  const { loading, isAuth, user } = UserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isAuth ? <Home /> : <Login />} />
            <Route path="/reels" element={isAuth ? <Reels /> : <Login />} />
            <Route
              path="/account"
              element={isAuth ? <Account user={user} /> : <Login />}
            />
            <Route path="/login" element={!isAuth ? <Login /> : <Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* ✅ Show NavigationBar only when user is authenticated */}
          {isAuth && <NavigationBar />}
        </BrowserRouter>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;
