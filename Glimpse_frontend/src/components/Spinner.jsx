import React from 'react';
import { Circles } from 'react-loader-spinner';

function Spinner({ message = "Loading..." }) {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <Circles
        height={50}
        width={50}
        color="#00BFFF"
        ariaLabel="loading-indicator"
        visible={true}
      />
      <p className='text-lg text-gray-500 mt-4'>{message}</p>
    </div>
  );
}

export default Spinner;
