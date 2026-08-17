'use client';

import React, { RefObject } from 'react';

export interface ChatMessage {
  role: 'user' | 'gemini';
  text: string;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  isPending: boolean;
  isEnglish: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function ChatMessageList({
  messages,
  isPending,
  isEnglish,
  messagesEndRef,
}: ChatMessageListProps) {
  return (
    <div
      className="
        flex-1
        p-4
        overflow-y-auto
        flex
        flex-col
        gap-3
        font-mono
        text-sm
        bg-[#e7e2d0]
        dark:bg-[#16171e]
      "
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`
            max-w-[85%]
            p-3
            rounded-lg
            border-2
            border-black
            dark:border-[#2f3340]
            ${
              msg.role === 'user'
                ? 'bg-black text-white dark:bg-amber-400 dark:text-black dark:border-amber-400 self-end shadow-[2px_2px_0px_#000000]'
                : 'bg-[#f4f0e3] text-black dark:bg-[#1f212a] dark:text-[#f3f4f6] self-start shadow-[2px_2px_0px_#000000]'
            }
          `}
        >
          {msg.text}
        </div>
      ))}

      {/* Loading indicator */}
      {isPending && (
        <div
          className="
            bg-[#f4f0e3]
            dark:bg-[#1f212a]
            border-2
            border-black
            dark:border-[#2f3340]
            text-black
            dark:text-amber-400
            self-start
            p-3
            rounded-lg
            animate-pulse
            font-mono
            text-xs
            font-bold
          "
        >
          {isEnglish ? 'Thinking...' : '생각 중...'}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
