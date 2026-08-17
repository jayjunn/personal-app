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
      "
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`
            max-w-[82%]
            p-3
            rounded-lg
            border-2
            border-black
            ${
              msg.role === 'user'
                ? 'bg-black text-white self-end'
                : 'bg-[#f4f0e3] text-black self-start'
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
            border-2
            border-black
            text-black
            self-start
            p-3
            rounded-lg
            animate-pulse
          "
        >
          {isEnglish ? 'Thinking...' : '생각 중...'}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
