'use client';

import React, { FormEvent, useState } from 'react';
import { sendContactEmail } from '../app/service/contact';

export interface IBanner {
  message: string;
  state: string;
}
const initialInputValue = {
  email: '',
  subject: '',
  message: '',
};

const initialBanner = {
  message: ``,
  state: 'SUCCESS',
};

export default function EmailForm() {
  const [inputValue, setInputValue] = useState(initialInputValue);
  const [banner, setBanner] = useState<IBanner | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendContactEmail(inputValue)
      .then(() => {
        setBanner({
          message: 'Email got sent successfully',
          state: 'SUCCESS',
        });
        setInputValue(initialInputValue);
      })
      .catch(() => {
        setBanner({
          message: "Email can't be sent please try it again",
          state: 'ERROR',
        });
      })
      .finally(() => {
        setTimeout(() => setBanner(null), 3000);
      });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <form className="px-4 flex flex-col gap-3 h-full justify-center items-center" onSubmit={handleSubmit}>
        <div className="w-full max-w-[700px]">
          <label className="text-[12px]" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            className="text-[10px] mt-0.5 focus:outline-none bg-primary-neutral h-2 border-2 border-black text-black rounded-lg focus:black block w-full p-  placeholder-stone-700 px-1 py-1.5 font-medium"
            placeholder="abc@domain.com"
            required
            id="email"
            onChange={handleInput}
            value={inputValue.email}
          />
        </div>
        <div className="w-full max-w-[700px]">
          <label className="text-[12px]" htmlFor="subject">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="text-[10px] mt-0.5 focus:outline-none bg-primary-neutral h-2 border-2 border-black text-black rounded-lg focus:black block w-full p-  placeholder-stone-700 px-1 py-1.5 font-medium"
            placeholder="Subject"
            required
            value={inputValue.subject}
            onChange={handleInput}
          />
        </div>
        <div className="w-full max-w-[700px]">
          <label className="text-[12px]" htmlFor="message">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            className="resize-none text-[10px] focus:outline-none bg-primary-neutral h-10 border-2 border-black text-black rounded-lg focus:black block w-full p-  placeholder-stone-700 px-1 py-1 font-medium"
            placeholder="Message..."
            rows={4}
            required
            value={inputValue.message}
            onChange={handleInput}
          />
        </div>
        <div className="flex justify-center mb-4">
          <button type="submit" className="border-2 border-black p-1 px-2 bg-black text-white font-normal rounded-sm text-[14px]">
            Send
          </button>
        </div>
      </form>
    </>
  );
}
