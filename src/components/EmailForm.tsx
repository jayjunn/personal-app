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
      <form className="px-4 py-8 flex flex-col gap-4 h-full justify-start items-center" onSubmit={handleSubmit} method="POST">
        <div className="w-full max-w-[700px]">
          <label className="text-sm font-bold block mb-1" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            className="text-sm focus:outline-none bg-[#e7e2d0] border-2 border-black text-black rounded-lg block w-full placeholder-stone-600 px-3 py-2 font-medium"
            placeholder="abc@domain.com"
            required
            id="email"
            onChange={handleInput}
            value={inputValue.email}
          />
        </div>
        <div className="w-full max-w-[700px]">
          <label className="text-sm font-bold block mb-1" htmlFor="subject">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="text-sm focus:outline-none bg-[#e7e2d0] border-2 border-black text-black rounded-lg block w-full placeholder-stone-600 px-3 py-2 font-medium"
            placeholder="Subject"
            required
            value={inputValue.subject}
            onChange={handleInput}
          />
        </div>
        <div className="w-full max-w-[700px]">
          <label className="text-sm font-bold block mb-1" htmlFor="message">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            className="resize-none text-sm focus:outline-none bg-[#e7e2d0] border-2 border-black text-black rounded-lg block w-full placeholder-stone-600 px-3 py-2 font-medium"
            placeholder="Message..."
            rows={5}
            required
            value={inputValue.message}
            onChange={handleInput}
          />
        </div>
        <div className="flex justify-center mb-4">
          <button
            type="submit"
            className="border-2 border-black px-8 py-2.5 mt-4 bg-black text-[#e7e2d0] font-bold rounded text-sm hover:bg-[#e7e2d0] hover:text-black transition-colors">
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </>
  );
}
