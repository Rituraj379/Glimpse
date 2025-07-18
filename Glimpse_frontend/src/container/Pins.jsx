import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Sidebar, Navbar, Search } from '../components';

const Feed = lazy(() => import('../components/Feed'));
const Pindetail = lazy(() => import('../components/Pindetail'));
const Createpin = lazy(() => import('../components/Createpin'));

function Pins({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef(null);
  const location = useLocation();

  // Scroll to top when the route changes
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="px-2 md:px-5" ref={scrollRef}>
      <div className="bg-gray-50">
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user} />
      </div>

      <div className="h-full">
        <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Feed searchTerm={searchTerm} />} />
            <Route path="/category/:categoryId" element={<Feed searchTerm={searchTerm} />} />
            <Route path="/pin-detail/:pinId" element={<Pindetail user={user} />} />
            <Route path="/create-pin" element={<Createpin user={user} />} />
            <Route path="/search" element={<Search searchTerm={searchTerm} user={user} />} />
            <Route path="*" element={<Feed searchTerm={searchTerm} />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default Pins;
