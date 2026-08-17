'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { isChatOpenAtom, chatMessagesAtom } from '@/store';
import { useMutation } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { fetchGeminiResponse } from '@/service/geminiService';
import ChatFloatingButton from './chatbot/ChatFloatingButton';
import ChatMessageList from './chatbot/ChatMessageList';
import ChatInput from './chatbot/ChatInput';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useAtom(isChatOpenAtom);
  const [messages, setMessages] = useAtom(chatMessagesAtom);
  const [input, setInput] = useState('');
  const { isEnglish, t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: fetchGeminiResponse,
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'gemini',
          text: data || t.chatbot.noResponse,
          timestamp: Date.now(),
        },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'gemini',
          text: t.chatbot.error,
          timestamp: Date.now(),
        },
      ]);
    },
  });

  // Automatically scroll down when a new message arrives or generation starts
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, mutation.isPending, isOpen]);

  const sendQuery = (text: string) => {
    if (!text.trim() || mutation.isPending) return;

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: text.trim(),
        timestamp: Date.now(),
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

  const handleClearHistory = () => {
    if (confirm(isEnglish ? 'Do you want to clear chat history?' : '대화 기록을 모두 지우시겠습니까?')) {
      setMessages([]);
    }
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
            h-[500px]
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
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-4 h-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 opacity-80 blur-[1px]" />
                <span className="animate-pulse absolute inline-flex h-3 w-3 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-300 to-emerald-400 opacity-90 blur-[0.5px]" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_8px_#38bdf8,0_0_12px_#a855f7]" />
              </div>
              <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-white dark:text-[#f3f4f6]">
                {t.chatbot.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  title={isEnglish ? 'Clear Chat History' : '대화 기록 지우기'}
                  className="text-neutral-400 hover:text-rose-400 text-xs font-bold transition-colors cursor-pointer px-1.5 py-0.5 border border-neutral-600 rounded">
                  {isEnglish ? 'Clear' : '초기화'}
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white dark:text-[#f3f4f6] font-bold hover:text-cyan-400 transition-colors text-lg cursor-pointer"
                aria-label="Close Chatbot"
              >
                ✕
              </button>
            </div>
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