'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { SendIcon } from '@/components/icons';

interface ChatInputProps {
  input: string;
  isPending: boolean;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ChatInput({
  input,
  isPending,
  onChange,
  onSubmit,
}: ChatInputProps) {
  const { t } = useLanguage();
  return (
    <form
      onSubmit={onSubmit}
      className="
        p-3
        border-t-[3px]
        border-black
        dark:border-[#272a34]
        bg-[#ded8c4]
        dark:bg-[#1f212a]
        flex
        gap-2
        items-center
      "
    >
      <input
        type="text"
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.chatbot.placeholder}
        className="
          flex-1
          min-w-0
          px-3
          py-2
          bg-[#f4f0e3]
          dark:bg-[#16171e]
          border-2
          border-black
          dark:border-[#2f3340]
          rounded
          text-base
          text-black
          dark:text-[#f3f4f6]
          placeholder:text-neutral-500
          focus:outline-none
          focus:ring-2
          focus:ring-black
          dark:focus:ring-cyan-400
          font-mono
        "
      />

      <button
        type="submit"
        disabled={isPending || !input.trim()}
        aria-label="Send message"
        className="
          w-10
          h-10
          shrink-0
          flex
          items-center
          justify-center
          rounded-full
          bg-black
          dark:bg-cyan-400
          text-white
          dark:text-black
          transition-all
          duration-200
          hover:bg-neutral-800
          dark:hover:bg-cyan-300
          hover:scale-105
          active:scale-90
          disabled:opacity-30
          disabled:hover:scale-100
          disabled:cursor-not-allowed
        "
      >
        <SendIcon className="w-[19px] h-[19px]" />
      </button>
    </form>
  );
}
