'use client';

import React, { RefObject } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import MarkdownText from './MarkdownText';

export interface ChatMessage {
  role: 'user' | 'gemini';
  text: string;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  isPending: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onSelectPrompt?: (prompt: string) => void;
}

export default function ChatMessageList({
  messages,
  isPending,
  messagesEndRef,
  onSelectPrompt,
}: ChatMessageListProps) {
  const { t } = useLanguage();

  const quickPrompts = [
    { label: t.chatbot.prompts.skillsLabel, query: t.chatbot.prompts.skills },
    { label: t.chatbot.prompts.experienceLabel, query: t.chatbot.prompts.experience },
    { label: t.chatbot.prompts.projectsLabel, query: t.chatbot.prompts.projects },
    { label: t.chatbot.prompts.contactLabel, query: t.chatbot.prompts.contact },
  ];

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
      {/* Welcome Greeting when no messages yet */}
      {messages.length === 0 && (
        <div
          className="
            max-w-[85%]
            p-3
            rounded-lg
            border-2
            border-black
            dark:border-[#2f3340]
            bg-[#f4f0e3]
            text-black
            dark:bg-[#1f212a]
            dark:text-[#f3f4f6]
            self-start
            shadow-[2px_2px_0px_#000000]
          "
        >
          {t.chatbot.greeting}
        </div>
      )}

      {/* Message History */}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`
            max-w-[88%]
            p-3
            rounded-lg
            border-2
            border-black
            dark:border-[#2f3340]
            ${
              msg.role === 'user'
                ? 'bg-black text-white dark:bg-cyan-400 dark:text-black dark:border-cyan-400 self-end shadow-[2px_2px_0px_#000000] whitespace-pre-wrap'
                : 'bg-[#f4f0e3] text-black dark:bg-[#1f212a] dark:text-[#f3f4f6] self-start shadow-[2px_2px_0px_#000000]'
            }
          `}
        >
          {msg.role === 'gemini' ? (
            <MarkdownText content={msg.text} />
          ) : (
            msg.text
          )}
        </div>
      ))}

      {/* Quick Prompts when no user messages yet */}
      {messages.length === 0 && !isPending && (
        <div className="flex flex-wrap gap-2 pt-1 pb-1">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt?.(item.query)}
              className="
                text-xs
                px-2.5
                py-1.5
                rounded-md
                border-2
                border-black
                dark:border-[#2f3340]
                bg-[#f4f0e3]
                dark:bg-[#1f212a]
                text-black
                dark:text-cyan-400
                hover:bg-black
                hover:text-white
                dark:hover:bg-cyan-400
                dark:hover:text-black
                transition-all
                duration-150
                shadow-[2px_2px_0px_#000000]
                active:translate-x-[1px]
                active:translate-y-[1px]
                cursor-pointer
                text-left
              "
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

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
            dark:text-cyan-400
            self-start
            p-3
            rounded-lg
            animate-pulse
            font-mono
            text-xs
            font-bold
          "
        >
          {t.chatbot.thinking}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
