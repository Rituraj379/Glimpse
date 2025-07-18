import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { sanityClient, urlFor } from '../Client';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

const Pin = ({ pin, onDelete }) => {
  const { image, postedBy, destination, _id } = pin;
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [saveList, setSaveList] = useState(pin.save || []);

  // Keep saveList in sync with pin.save to avoid memory leaks
  React.useEffect(() => {
    setSaveList(pin.save || []);
  }, [pin.save]);

  const navigate = useNavigate();

  // Parse user safely from localStorage
  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      user = JSON.parse(storedUser);
    } else {
      localStorage.clear();
    }
  } catch (error) {
    console.error('Invalid user data in localStorage:', error);
    localStorage.clear();
  }

  if (!user) {
    return null;
  }

  const userId = user._id;
  const posterId = postedBy?._id || postedBy?._ref;
  
  const alreadySaved = saveList.some((item) => item?.postedBy?._id === userId);

  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);
      const newSave = {
        _key: uuidv4(),
        postedBy: {
          _type: 'postedBy',
          _ref: userId,
        },
      };
      sanityClient
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [newSave])
        .commit()
        .then(() => {
          // Instead of generating a new uuid, just add the same object
          setSaveList((prev) => [...prev, { ...newSave, postedBy: { _id: userId } }]);
          setSavingPost(false);
        })
        .catch((err) => {
          console.error('Error saving pin:', err);
          setSavingPost(false);
        });
    }
  };

  const deletePin = (id) => {
    sanityClient
      .delete(id)
      .then(() => {
        if (onDelete) {
          onDelete(id);
        }
      });
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pindetail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg transition-all duration-500 ease-in-out"
      >
        <img
          className="rounded-lg w-full transition-opacity duration-500 ease-in-out opacity-0"
          onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
          loading="lazy"
          alt="user-post"
          src={urlFor(image).width(250).height(350).quality(80).url()}
        />

        {postHovered && (
          <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white p-2 rounded-full text-dark hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>

              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold p-2 rounded-full hover:shadow-md outline-none"
                >
                  {saveList.length} Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold p-2 rounded-full hover:shadow-md outline-none"
                >
                  {savingPost ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>

            <div className="flex justify-between items-center w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 rounded-full hover:shadow-md outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BsFillArrowUpRightCircleFill /> 
                  {destination.length > 15 ? `${destination.slice(0, 15)}...` : destination }
                </a>
              )}
              {posterId === userId && (
                <button
                  type="button"
                  className="bg-white p-2 opacity-90 hover:opacity-100 text-dark font-bold rounded-full hover:shadow-md outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${postedBy?._id || postedBy?._ref}`}  
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image || 'https://via.placeholder.com/150'}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">
          {postedBy?.userName || 'Unknown User'}
        </p>
        </Link>
    </div>
  );
}

export default Pin;

