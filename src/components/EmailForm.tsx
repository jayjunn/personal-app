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
          message: '이메일이 성공적으로 전송되었습니다! ✅',
        });
        setInputValue(initialInputValue);
      })
      .catch(() => {
        setBanner({
          message: '이메일 전송에 실패했습니다. 다시 시도해주세요.',
        });
      })
      .finally(() => {
        setTimeout(() => setBanner(null), 3500);
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
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="flex flex-col gap-5 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs sm:text-sm font-extrabold uppercase text-black">
              이메일 주소 (Email Address)
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="your-email@example.com"
              onChange={handleInput}
              value={inputValue.email}
              className="w-full p-3.5 sm:p-4 bg-white border-2 border-black text-sm font-medium outline-none focus:bg-neutral-50 box-border"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="subject"
              className="text-xs sm:text-sm font-extrabold uppercase text-black">
              제목 (Subject)
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              required
              placeholder="프로젝트 제안 / 문의 내용"
              onChange={handleInput}
              value={inputValue.subject}
              className="w-full p-3.5 sm:p-4 bg-white border-2 border-black text-sm font-medium outline-none focus:bg-neutral-50 box-border"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label
            htmlFor="message"
            className="text-xs sm:text-sm font-extrabold uppercase text-black">
            메시지 본문 (Message)
          </label>
          <textarea
            name="message"
            id="message"
            required
            rows={5}
            placeholder="남기실 메시지를 작성해주세요..."
            onChange={handleInput}
            value={inputValue.message}
            className="w-full p-3.5 sm:p-4 bg-white border-2 border-black text-sm font-medium outline-none focus:bg-neutral-50 leading-relaxed resize-y box-border"
          />
        </div>

        <div className="flex justify-end pt-2.5 w-full">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-[#e7e2d0] border-2 border-black px-8 py-3.5 font-extrabold text-sm uppercase transition-all hover:bg-neutral-800 shadow-[3px_3px_0px_#000000] cursor-pointer disabled:opacity-60">
            {isLoading ? '전송 처리 중...' : '메시지 전송 (Send Message) ➔'}
          </button>
        </div>
      </form>
    </>
  );
}
