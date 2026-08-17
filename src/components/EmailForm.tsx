'use client';

import React, { FormEvent, useState } from 'react';
import { useContactEmailMutation } from '@/hooks/usePortfolioQueries';
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

  const contactMutation = useContactEmailMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (contactMutation.isPending) return;

    contactMutation.mutate(inputValue, {
      onSuccess: () => {
        setBanner({
          message: '이메일이 성공적으로 전송되었습니다! ✅',
        });
        setInputValue(initialInputValue);
        setTimeout(() => setBanner(null), 3500);
      },
      onError: () => {
        setBanner({
          message: '이메일 전송에 실패했습니다. 다시 시도해주세요.',
        });
        setTimeout(() => setBanner(null), 3500);
      },
    });
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {banner && <Toast message={banner.message} />}
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="flex flex-col gap-5 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs sm:text-sm font-extrabold uppercase text-black dark:text-[#f3f4f6]"
            >
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
              className="w-full p-3.5 sm:p-4 bg-[#fbf9f4] dark:bg-[#16171e] border-2 border-black dark:border-[#2f3340] text-black dark:text-[#f3f4f6] text-sm font-medium outline-none focus:bg-[#ede8d5] dark:focus:bg-[#1f212a] dark:focus:border-cyan-400 box-border"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="subject"
              className="text-xs sm:text-sm font-extrabold uppercase text-black dark:text-[#f3f4f6]"
            >
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
              className="w-full p-3.5 sm:p-4 bg-[#fbf9f4] dark:bg-[#16171e] border-2 border-black dark:border-[#2f3340] text-black dark:text-[#f3f4f6] text-sm font-medium outline-none focus:bg-[#ede8d5] dark:focus:bg-[#1f212a] dark:focus:border-cyan-400 box-border"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label
            htmlFor="message"
            className="text-xs sm:text-sm font-extrabold uppercase text-black dark:text-[#f3f4f6]"
          >
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
            className="w-full p-3.5 sm:p-4 bg-[#fbf9f4] dark:bg-[#16171e] border-2 border-black dark:border-[#2f3340] text-black dark:text-[#f3f4f6] text-sm font-medium outline-none focus:bg-[#ede8d5] dark:focus:bg-[#1f212a] dark:focus:border-cyan-400 leading-relaxed resize-y box-border"
          />
        </div>

        <div className="flex justify-end pt-2.5 w-full">
          <button
            type="submit"
            disabled={contactMutation.isPending}
            className="
              w-full
              sm:w-auto
              inline-flex
              items-center
              justify-center
              gap-2
              bg-black
              dark:bg-white
              text-[#e7e2d0]
              dark:text-black
              border-2
              border-black
              dark:border-white
              px-8
              py-3.5
              font-extrabold
              text-sm
              uppercase
              transition-all
              hover:bg-neutral-800
              dark:hover:bg-neutral-200
              shadow-[3px_3px_0px_#000000]
              cursor-pointer
              disabled:opacity-60
            "
          >
            {contactMutation.isPending
              ? '전송 처리 중...'
              : '메시지 전송 (Send Message) ➔'}
          </button>
        </div>
      </form>
    </>
  );
}
