import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { sanityClient, urlFor } from '../client';
import Spinner from './Spinner';
import { categories } from '../utils/data';

function Createpin({ user }) {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const navigate = useNavigate();
  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please fill in all the fields</p>
      )}
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white p-5 rounded-lg lg:w-4/5 w-full'>
        {/* Image upload section */}
        <div className='flex flex-col justify-center items-center border-2 border-dotted border-gray-300 p-3 w-96 min-h-72 relative'>
          {loading && <Spinner />}
          {!imageAsset ? (
            <label className='cursor-pointer w-full h-full flex flex-col items-center justify-center'>
              <div className='flex flex-col items-center justify-center h-full'>
                <AiOutlineCloudUpload className='text-gray-500 text-6xl' />
                <p className='text-gray-500 text-xl'>Click to upload</p>
              </div>
              <input
                type='file'
                name='upload-image'
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
                    setWrongImageType(false);
                    setLoading(true);
                    sanityClient.assets
                      .upload('image', file, { contentType: file.type, filename: file.name })
                      .then((document) => {
                        setImageAsset(document);
                        setLoading(false);
                      })
                      .catch((error) => {
                        console.error('Upload failed:', error);
                        setLoading(false);
                      });
                  } else {
                    setWrongImageType(true);
                  }
                }}
                className='hidden'
              />
            </label>
          ) : (
            <div className='relative flex flex-col justify-center items-center w-full'>
              <img
                src={urlFor(imageAsset).url()}
                alt='uploaded-pic'
                className='rounded-lg max-w-full max-h-96 object-contain'
                style={{ aspectRatio: `${imageAsset?.metadata?.dimensions?.width || 1} / ${imageAsset?.metadata?.dimensions?.height || 1}` }}
              />
              <button
                type='button'
                onClick={() => setImageAsset(null)}
                className='absolute bottom-3 right-3 p-2 rounded-full bg-white text-red-500 hover:bg-red-100 shadow-md'
              >
                <MdDelete />
              </button>
            </div>
          )}
          {wrongImageType && (
            <p className='text-red-500 mt-2'>Please upload a JPEG or PNG image.</p>
          )}
        </div>
        {/* Pin details section */}
        <div className='flex flex-1 flex-col gap-4 mt-5 lg:mt-0 lg:ml-5 w-full'>
          <input
            type='text'
            placeholder='Add your title here'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='outline-none text-xl sm:text-2xl border-b-2 border-gray-200 p-2'
          />
          {user && (
            <div className='flex gap-2 items-center my-2'>
              <img src={user.image} alt='user-profile' className='w-10 h-10 rounded-full' />
              <p className='font-bold'>{user.userName}</p>
            </div>
          )}
          <input
            type='text'
            placeholder='Tell everyone what your Pin is about'
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className='outline-none border-b-2 border-gray-200 p-2'
          />
          <input
            type='url'
            placeholder='Add a destination link'
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className='outline-none border-b-2 border-gray-200 p-2'
          />
          <div>
            <p className='mb-2 font-semibold'>Choose Pin Category</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className='outline-none w-full border-b-2 border-gray-200 p-2 rounded-md'
              value={category || ''}
            >
              <option value='' disabled>Select Category</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className='flex justify-end items-end mt-4'>
            <button
              type='button'
              onClick={async () => {
                if (!title || !about || !destination || !imageAsset || !category) {
                  setFields(true);
                  setTimeout(() => setFields(false), 2000);
                  return;
                }
                setLoading(true);
                const doc = {
                  _type: 'pin',
                  title,
                  about,
                  destination,
                  image: {
                    _type: 'image',
                    asset: {
                      _type: 'reference',
                      _ref: imageAsset._id,
                    },
                  },
                  userId: user._id,
                  postedBy: {
                    _type: 'postedBy',
                    _ref: user._id,
                  },
                  category,
                };
                try {
                  await sanityClient.create(doc);
                  setLoading(false);
                  navigate('/');
                } catch (err) {
                  setLoading(false);
                  alert('Error saving pin!');
                  console.error(err);
                }
              }}
              className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none hover:bg-red-600 transition-colors flex items-center justify-center'
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Createpin;