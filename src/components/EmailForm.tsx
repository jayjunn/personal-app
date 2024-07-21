'use client';

import React, { FormEvent, useState } from 'react';
import { sendContactEmail } from '../app/service/contact';
import Toast from './common/Toast';

export interface IBanner {
  message: string;
}
const initialInputValue = {
  email: '',
  subject: '',
  message: '',
};

export default function EmailForm() {
  const [inputValue, setInputValue] = useState(initialInputValue);
  const [banner, setBanner] = useState<IBanner | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    sendContactEmail(inputValue)
      .then(() => {
        setBanner({
          message: 'Email got sent successfully',
        });
        setInputValue(initialInputValue);
      })
      .catch(() => {
        setBanner({
          message: "Email can't be sent please try it again",
        });
      })
      .finally(() => {
        setTimeout(() => setBanner(null), 3000);
        setIsLoading(false);
      });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {banner && <Toast message={banner.message} />}
      <form className="px-4 flex flex-col gap-3 h-full justify-center items-center" onSubmit={handleSubmit} method="POST">
        <div className="w-full max-w-[700px]">
          <label className="text-xs" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            className="text-xs mt-0.5 focus:outline-none bg-primary-neutral h-2 border-2 border-black text-black rounded-lg focus:black block w-full p-  placeholder-stone-700 px-2 py-3 font-medium"
            placeholder="abc@domain.com"
            required
            id="email"
            onChange={handleInput}
            value={inputValue.email}
          />
        </div>
        <div className="w-full max-w-[700px]">
          <label className="text-xs" htmlFor="subject">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="text-xs mt-0.5 focus:outline-none bg-primary-neutral h-2 border-2 border-black text-black rounded-lg focus:black block w-full p-  placeholder-stone-700 px-2 py-3 font-medium"
            placeholder="Subject"
            required
            value={inputValue.subject}
            onChange={handleInput}
          />
        </div>
        <div className="w-full max-w-[700px]">
          <label className="text-xs" htmlFor="message">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            className="resize-none text-xs focus:outline-none bg-primary-neutral h-30 border-2 border-black text-black rounded-lg focus:black block w-full p-  placeholder-stone-700 px-2 py-1 font-medium"
            placeholder="Message..."
            rows={4}
            required
            value={inputValue.message}
            onChange={handleInput}
          />
        </div>
        <div className="flex justify-center mb-4">
          <button
            type="submit"
            className="border-2 border-black w-10 flex items-center justify-center p-2 px-6 mt-8 bg-black text-stone-200 font-normal rounded-sm text-[14px]">
            {isLoading ? 'Sending' : 'Send'}
          </button>
        </div>
      </form>
    </>
  );
}
