'use client';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { isChatOpenAtom } from '@/context/chatStore';
import { useMutation } from '@tanstack/react-query';

interface Message {
  role: 'user' | 'gemini';
  text: string;
}

// API 호출 함수 분리
const fetchGeminiResponse = async (prompt: string) => {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed');
  return data.text;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useAtom(isChatOpenAtom);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'gemini', text: '안녕하세요! 영근님의 포트폴리오에 대해 무엇이든 물어보세요.' }
  ]);

  // React Query의 useMutation 사용
  const mutation = useMutation({
    mutationFn: fetchGeminiResponse,
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: 'gemini', text: data || '응답을 받지 못했습니다.' },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { role: 'gemini', text: '오류가 발생했습니다. 다시 시도해 주세요.' },
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || mutation.isPending) return;

    const userMessage = input;
    setInput('');
    
    // 유저 메시지 먼저 화면에 추가
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    
    // Mutation 실행 (API 요청)
    mutation.mutate(userMessage);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-6 p-4 bg-black text-white rounded-full shadow-lg z-[9999] hover:scale-110 transition-transform"
        aria-label="Open Chatbot"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[450px] bg-[#fdfbf7] border-[3px] border-black rounded-xl shadow-2xl z-[9999] flex flex-col overflow-hidden box-border">
          <div className="bg-black text-white px-4 py-3 flex justify-between items-center">
            <span className="font-black text-sm uppercase tracking-wider">AI Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-white font-bold hover:text-gray-300">
              ✕
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 font-mono text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-black text-white self-end'
                    : 'bg-white border-2 border-black text-black self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {mutation.isPending && (
              <div className="bg-white border-2 border-black text-black self-start p-3 rounded-lg animate-pulse">
                생각 중...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t-[3px] border-black bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-3 py-2 border-2 border-black rounded text-sm focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-black text-white font-black text-sm rounded hover:bg-neutral-800 transition-colors"
            >
              전송
            </button>
          </form>
        </div>
      )}
    </>
  );
}