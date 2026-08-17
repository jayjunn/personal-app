'use client';

import React, { RefObject } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import MarkdownText from './MarkdownText';
import { ChatMessage } from '@/store/chatAtom';

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
        scroll-smooth
      "
    >
      {/* Welcome Greeting when no messages yet */}
      {messages.length === 0 && (
        <div
          className="
            max-w-[88%]
            p-3.5
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
            leading-relaxed
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
                ? 'bg-black text-[#e7e2d0] dark:bg-[#ded8c4] dark:text-black dark:border-[#ded8c4] self-end shadow-[2px_2px_0px_#000000] whitespace-pre-wrap'
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
            dark:text-[#ded8c4]
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

      {/* Quick Prompts Category Section (항상 답변 완료 후 또는 최초 시작 시 노출) */}
      {!isPending && (
        <div className="flex flex-col gap-1.5 pt-1.5 pb-1">
          {messages.length > 0 && (
            <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 px-0.5">
              💡 추천 질문 더보기:
            </span>
          )}
          <div className="flex flex-wrap gap-1.5">
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
                  dark:text-[#f3f4f6]
                  hover:bg-black
                  hover:text-white
                  dark:hover:bg-[#ded8c4]
                  dark:hover:text-black
                  dark:hover:border-[#ded8c4]
                  transition-all
                  duration-150
                  shadow-[2px_2px_0px_#000000]
                  dark:shadow-[2px_2px_0px_#000000]
                  active:translate-x-[1px]
                  active:translate-y-[1px]
                  cursor-pointer
                  text-left
                  font-medium
                "
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
