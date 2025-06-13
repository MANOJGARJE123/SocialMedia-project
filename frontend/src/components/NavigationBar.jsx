import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BsCameraReelsFill, BsCameraReels } from "react-icons/bs";
import { IoSearchCircleOutline, IoSearchCircleSharp } from "react-icons/io5";
import { IoChatbubbleEllipses, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdAccountCircle, MdOutlineAccountCircle } from "react-icons/md";

const NavigationBar = () => {
  const [tab, setTab] = useState(window.location.pathname);

  return (
    <div className="fixed bottom-0 w-full bg-white py-3">
      <div className="flex justify-around">

        <Link to="/" onClick={() => setTab("/")} className="flex flex-col items-center text-2xl">
          <span>{tab === "/" ? <AiFillHome /> : <AiOutlineHome />}</span>
        </Link>

        <Link to="/reels" onClick={() => setTab("/reels")} className="flex flex-col items-center text-2xl">
          <span>{tab === "/reels" ? <BsCameraReelsFill /> : <BsCameraReels />}</span>
        </Link>

        <Link to="/search" onClick={() => setTab("/search")} className="flex flex-col items-center text-2xl">
          <span>{tab === "/search" ? <IoSearchCircleSharp /> : <IoSearchCircleOutline />}</span>
        </Link>

        <Link to="/chat" onClick={() => setTab("/chat")} className="flex flex-col items-center text-2xl">
          <span>{tab === "/chat" ? <IoChatbubbleEllipses /> : <IoChatbubbleEllipsesOutline />}</span>
        </Link>

        <Link to="/account" onClick={() => setTab("/account")} className="flex flex-col items-center text-2xl">
          <span>{tab === "/account" ? <MdAccountCircle /> : <MdOutlineAccountCircle />}</span>
        </Link>
        
      </div>
    </div>
  );
};

export default NavigationBar;
