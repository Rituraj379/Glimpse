import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';

import { Sidebar, Navbar, Feed, Pindetail, Createpin, Search, UserProfile } from '../components';
import { sanityClient } from '../client';
import { userQuery } from '../utils/data';
import logo from '../Assets0/logo.png';

function Home() {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef(null);

  const userInfo = localStorage.getItem('user');
  const parsedUser = userInfo ? JSON.parse(userInfo) : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (!parsedUser) return;

      const query = userQuery(parsedUser._id);
      try {
        const result = await sanityClient.fetch(query);
        setUser(result[0]);
      } catch (error) {
        console.error('❌ Error fetching user:', error);
      }
    };

    fetchUser();
  }, [userInfo]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  // Disable scroll on mobile when sidebar is open
  useEffect(() => {
    document.body.style.overflow = toggleSidebar ? 'hidden' : 'auto';
  }, [toggleSidebar]);

  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
      
      {/* Sidebar for Desktop */}
      <div className='hidden md:flex h-screen flex-initial w-[240px]'>
        <Sidebar user={user} />
      </div>

      {/* Mobile Top Bar */}
      <div className='flex md:hidden flex-row'>
        <div className='flex justify-between items-center p-2 shadow-md w-full'>
          <HiMenu fontSize={40} className='cursor-pointer text-3xl' onClick={() => setToggleSidebar(true)} />
          <Link to='/'>
            <img src={logo} alt='logo' className='w-28' />
          </Link>
          <Link to={`/user-profile/${user?._id}`}>
            <img
              src={user?.image || 'https://i.stack.imgur.com/l60Hf.png'}
              alt='user profile'
              className='w-10 h-10 rounded-full object-cover border-2 border-gray-300'
            />
          </Link>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 left-0 h-screen z-50 bg-white shadow-lg transition-transform duration-300 ease-in-out 
            ${toggleSidebar ? 'translate-x-0' : '-translate-x-full'} w-[240px]`}
        >
          <div className='absolute w-full flex justify-end items-center p-2'>
            <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
          </div>
          <Sidebar user={user} closeToggle={setToggleSidebar} />
        </div>
      </div>

      {/* Main Content */}
      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user} />

        <Routes>
          <Route path='/' element={<Feed searchTerm={searchTerm} />} />
          <Route path='/category/:categoryId' element={<Feed searchTerm={searchTerm} />} />
          <Route path='/pindetail/:pinId' element={<Pindetail user={user} />} />
          <Route path='/create-pin' element={<Createpin user={user} />} />
          <Route path='/search' element={<Search searchTerm={searchTerm} user={user} />} />
          <Route path='/user-profile/:userId' element={<UserProfile user={user} />} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
