'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { isChatOpenAtom } from '@/store';
import { useMutation } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { fetchGeminiResponse } from '@/service/geminiService';
import ChatFloatingButton from './chatbot/ChatFloatingButton';
import ChatMessageList, { ChatMessage } from './chatbot/ChatMessageList';
import ChatInput from './chatbot/ChatInput';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useAtom(isChatOpenAtom);
  const [input, setInput] = useState('');
  const { isEnglish, t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const mutation = useMutation({
    mutationFn: fetchGeminiResponse,
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'gemini',
          text: data || t.chatbot.noResponse,
        },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'gemini',
          text: t.chatbot.error,
        },
      ]);
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages, mutation.isPending, isOpen]);

  const sendQuery = (text: string) => {
    if (!text.trim() || mutation.isPending) return;

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: text.trim(),
      },
    ]);

    mutation.mutate({
      prompt: text.trim(),
      language: isEnglish ? 'English' : 'Korean',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || mutation.isPending) return;

    const userMessage = input.trim();
    setInput('');
    sendQuery(userMessage);
  };

  return (
    <>
      {/* Floating AI Orb Launcher */}
      <ChatFloatingButton
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {/* Chat Window */}
      {isOpen && (
        <div
          className="
            fixed
            bottom-24
            right-6
            w-80
            sm:w-96
            h-[460px]
            bg-[#e7e2d0]
            dark:bg-[#16171e]
            border-[3px]
            border-black
            dark:border-[#272a34]
            rounded-xl
            shadow-[8px_8px_0px_rgba(0,0,0,1)]
            z-[8500]
            flex
            flex-col
            overflow-hidden
            box-border
          "
        >
          {/* Header */}
          <div
            className="
              bg-black
              dark:bg-[#1f212a]
              border-b-2
              border-black
              dark:border-[#272a34]
              text-white
              dark:text-cyan-400
              px-4
              py-3
              flex
              justify-between
              items-center
            "
          >
            <div className="flex items-center gap-2">
              <span
                className="
                  w-2.5
                  h-2.5
                  rounded-full
                  bg-cyan-400
                  shadow-[0_0_10px_#22d3ee]
                  animate-pulse
                "
              />
              <span className="font-black text-sm uppercase tracking-wider text-white dark:text-[#f3f4f6]">
                {t.chatbot.title}
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white dark:text-[#f3f4f6] font-bold hover:text-cyan-400 transition-colors text-lg"
              aria-label="Close Chatbot"
            >
              ✕
            </button>
          </div>

          {/* Messages Stream */}
          <ChatMessageList
            messages={messages}
            isPending={mutation.isPending}
            messagesEndRef={messagesEndRef}
            onSelectPrompt={sendQuery}
          />

          {/* Input & Submit */}
          <ChatInput
            input={input}
            isPending={mutation.isPending}
            onChange={setInput}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </>
  );
}