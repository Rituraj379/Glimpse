import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../Assets0/share.mp4';
import logo from '../Assets0/logowhite.png';
import { sanityClient } from '../client';
import { jwtDecode } from 'jwt-decode'; // correct import for jwt-decode

function decodeJwt(token) {
  if (!token) return {};
  return jwtDecode(token);
}

function Login() {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    const decoded = decodeJwt(credentialResponse.credential);
    const { name, sub: googleId, picture: imageUrl } = decoded;

    const user = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl,
    };

    // ✅ Store your custom user instead of the raw Google payload
    localStorage.setItem('user', JSON.stringify(user));

    sanityClient.createIfNotExists(user).then(() => {
      navigate('/', { replace: true });
    });
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
          src={shareVideo}
          type='video/mp4'
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
        <div>
          <div className='absolute flex flex-col justify-center items-center top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)]'>
            <div className='p-5'>
              <img src={logo} width="130px" alt="logo" />
            </div>
            <div className='shadow-2xl'>
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;