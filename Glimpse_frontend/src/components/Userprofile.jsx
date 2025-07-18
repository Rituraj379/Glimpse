import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai';
import { googleLogout } from '@react-oauth/google';
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { sanityClient } from '../Client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const randomImage = 'https://picsum.photos/1600/900';

const activeBtnStyle = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyle = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

function Userprofile() {
  console.log('Userprofile render');
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();
  console.log('userId from useParams:', userId);
  console.log('user state:', user);
  console.log('pins state:', pins);
  console.log('activeBtn state:', activeBtn);

  useEffect(() => {
    console.log('userQuery useEffect triggered with userId:', userId);
    const query = userQuery(userId);
    console.log('userQuery:', query);
    sanityClient.fetch(query).then((data) => {
      console.log('Fetched user data:', data);
      setUser(data[0]);
    }).catch((err) => {
      console.error('Error fetching user:', err);
    });
  }, [userId]);

  useEffect(() => {
    const MAX_PINS = 20; // Limit pins for debugging
    console.log('pins useEffect triggered with activeBtn:', activeBtn, 'userId:', userId);
    if (activeBtn === 'created') {
      const createdQuery = userCreatedPinsQuery(userId);
      console.log('createdQuery:', createdQuery);
      sanityClient.fetch(createdQuery)
        .then((data) => {
          console.log('Fetched created pins:', data);
          setPins(data ? data.slice(0, MAX_PINS) : []);
        })
        .catch((err) => {
          console.error('Error fetching created pins:', err);
          setPins([]);
        });
    } else {
      const savedQuery = userSavedPinsQuery(userId);
      console.log('savedQuery:', savedQuery);
      sanityClient.fetch(savedQuery)
        .then((data) => {
          console.log('Fetched saved pins:', data);
          setPins(data ? data.slice(0, MAX_PINS) : []);
        })
        .catch((err) => {
          console.error('Error fetching saved pins:', err);
          setPins([]);
        });
    }
  }, [activeBtn, userId]);

  let loggedInUser = null;
  try {
    loggedInUser = JSON.parse(localStorage.getItem('user'));
    console.log('loggedInUser from localStorage:', loggedInUser);
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
  }

  if (!user) {
    console.log('User is null, showing Spinner');
    return <Spinner message="Loading profile..." />;
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="flex flex-col justify-center items-center">
          <img
            src={randomImage}
            className="w-full h-80 2xl:h-510 shadow-lg object-cover"
            alt="banner-picture"
          />
          <img
            className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
            src={user?.image || randomImage}
            alt="user-profile"
          />
          <h1 className="font-bold text-2xl text-center mt-3">{user?.userName}</h1>

          <div className="absolute top-0 z-1 right-0 p-2">
            {loggedInUser?._id === userId && (
              <button
                type="button"
                className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  navigate('/login');
                }}
              >
                <AiOutlineLogout color="red" fontSize={21} />
              </button>
            )}
          </div>

          <div className="text-center mb-7 mt-5">
            <button
              type="button"
              onClick={() => setActiveBtn('created')}
              className={activeBtn === 'created' ? activeBtnStyle : notActiveBtnStyle}
            >
              Created
            </button>
            <button
              type="button"
              onClick={() => setActiveBtn('saved')}
              className={activeBtn === 'saved' ? activeBtnStyle : notActiveBtnStyle}
            >
              Saved
            </button>
          </div>
        </div>

        <div className="px-2">
          {/* MasonryLayout temporarily removed for debugging */}
          {Array.isArray(pins) && pins.length > 0 ? (
            <div style={{color: 'red', fontWeight: 'bold'}}>Test: Pins loaded ({pins.length})</div>
          ) : (
            <div className="text-center font-bold text-xl mt-2">
              No Pins Found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Userprofile;
