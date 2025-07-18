import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';

import { Sidebar, UserProfile } from '../components';
import { userQuery } from '../utils/data';
import { sanityClient } from '../client';
import Pins from './Pins';
import logo from '../Assets0/logo.png';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  // Get user from localStorage and fetch full user data
  useEffect(() => {
    const getUserInfo = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'undefined') {
          return JSON.parse(userStr);
        }
        return null;
      } catch (err) {
        console.error('Failed to parse user:', err);
        localStorage.removeItem('user');
        return null;
      }
    };

    const userInfo = getUserInfo();
    if (!userInfo?.googleId) return;

    const query = userQuery(userInfo.googleId);
    sanityClient.fetch(query).then((data) => {
      if (data?.length > 0) setUser(data[0]);
    });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      {/* Sidebar for medium+ screens */}
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user} />
      </div>

      {/* Topbar for small screens */}
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`/user-profile/${user?._id}`}>
            <img
              src={user?.image || 'https://i.stack.imgur.com/l60Hf.png'}
              alt="user-pic"
              className="w-9 h-9 rounded-full object-cover"
            />
          </Link>
        </div>

        {/* Sidebar drawer */}
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar closeToggle={setToggleSidebar} user={user} />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
