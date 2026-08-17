'use client';

import React from 'react';
import { SendIcon } from '@/components/icons';

interface ChatInputProps {
  input: string;
  isPending: boolean;
  isEnglish: boolean;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ChatInput({
  input,
  isPending,
  isEnglish,
  onChange,
  onSubmit,
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="
        p-3
        border-t-[3px]
        border-black
        bg-[#ded8c4]
        flex
        gap-2
        items-center
      "
    >
      <input
        type="text"
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          isEnglish ? 'Ask me anything...' : '무엇이든 물어보세요...'
        }
        className="
          flex-1
          min-w-0
          px-3
          py-2
          bg-[#f4f0e3]
          border-2
          border-black
          rounded
          text-base
          text-black
          placeholder:text-neutral-500
          focus:outline-none
          focus:ring-2
          focus:ring-black
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
          text-white
          transition-all
          duration-200
          hover:bg-neutral-800
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
