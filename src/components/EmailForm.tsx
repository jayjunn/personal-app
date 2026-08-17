'use client';

import React, { FormEvent, useState } from 'react';
import { useContactEmailMutation } from '@/hooks/usePortfolioQueries';
import { useLanguage } from '@/hooks/useLanguage';
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
  const { t } = useLanguage();

  const contactMutation = useContactEmailMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (contactMutation.isPending) return;

    contactMutation.mutate(inputValue, {
      onSuccess: () => {
        setBanner({
          message: t.contact.successToast,
        });
        setInputValue(initialInputValue);
        setTimeout(() => setBanner(null), 3500);
      },
      onError: () => {
        setBanner({
          message: t.contact.errorToast,
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
              {t.contact.emailLabel}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder={t.contact.emailPlaceholder}
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
              {t.contact.subjectLabel}
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              required
              placeholder={t.contact.subjectPlaceholder}
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
            {t.contact.messageLabel}
          </label>
          <textarea
            name="message"
            id="message"
            required
            rows={5}
            placeholder={t.contact.messagePlaceholder}
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
              ? t.contact.sendingButton
              : t.contact.sendButton}
          </button>
        </div>
      </form>
    </>
  );
}
