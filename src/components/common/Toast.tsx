import React from 'react';

interface IToast {
  message: string;
}

export default function Toast({ message }: IToast) {
  return (
    <div className="absolute top-1/2 left-1/2 justify-center -translate-x-1/2 -translate-y-1/2  text-stone-100 items-center flex h-20 text-center w-[300px] rounded-md bg-gray-900 opacity-90 font-normal text-sm">
      {message}
    </div>
  );
}
