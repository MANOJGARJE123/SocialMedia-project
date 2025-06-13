import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserData } from "./context/UserContext";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import NavigationBar from "./components/NavigationBar"; // ✅ Import NavigationBar

const App = () => {
  const { loading, isAuth, user } = UserData();

  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <BrowserRouter>
          <>
            <Routes>
              <Route path="/" element={isAuth ? <Home /> : <Login />} />
              <Route
                path="/account"
                element={isAuth ? <Account user={user} /> : <Login />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>

            {/* ✅ Show NavigationBar only when user is authenticated */}
            {isAuth && <NavigationBar />}
          </>
        </BrowserRouter>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;
