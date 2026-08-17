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
    { role: 'gemini', text: '안녕하세요! 영근님의 대해 무엇이든 물어보세요.' }
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
 <div className="fixed bottom-20 right-6 z-[9999]">
  <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />

  <button
  onClick={() => setIsOpen(!isOpen)}
  className="
    fixed bottom-20 right-6 z-[9999]
    w-16 h-16
    rounded-full
    flex items-center justify-center
    transition-all duration-500
    hover:scale-110
    active:scale-95
    group
  "
  aria-label="Open Chatbot"
>
  {/* Outer glow */}
  <span
    className="
      absolute inset-[-10px]
      rounded-full
      bg-gradient-to-r
      from-cyan-300/0
      via-white/40
      to-purple-300/0
      blur-xl
      opacity-80
      animate-pulse
    "
  />

  {/* Rotating aura */}
  <span
    className="
      absolute inset-[-4px]
      rounded-full
      bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.9),rgba(150,200,255,0.8),transparent)]
      blur-[2px]
      animate-[spin_4s_linear_infinite]
    "
  />

  {/* Main orb */}
  <span
    className="
      relative
      w-14 h-14
      rounded-full
      bg-black
      flex items-center justify-center
      overflow-hidden
      shadow-[0_0_15px_rgba(255,255,255,0.5),0_0_40px_rgba(120,180,255,0.25)]
      border border-white/40
    "
  >
    {/* Inner light */}
    <span
      className="
        absolute
        w-8 h-8
        rounded-full
        bg-gradient-to-br
        from-white
        via-cyan-200
        to-purple-400
        blur-md
        opacity-80
        animate-pulse
      "
    />

   {/* AI Sparkle */}
<svg
  width="28"
  height="28"
  viewBox="0 0 28 28"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="
    relative
    drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]
    drop-shadow-[0_0_14px_rgba(140,200,255,0.8)]
  "
>
  {/* Main sparkle */}
  <path
    d="M14 2.5
       C14.7 8.7 17.3 11.3 23.5 12
       C17.3 12.7 14.7 15.3 14 21.5
       C13.3 15.3 10.7 12.7 4.5 12
       C10.7 11.3 13.3 8.7 14 2.5Z"
    fill="white"
  />

  {/* Small sparkle */}
  <path
    d="M22 17
       C22.3 19.7 23.3 20.7 26 21
       C23.3 21.3 22.3 22.3 22 25
       C21.7 22.3 20.7 21.3 18 21
       C20.7 20.7 21.7 19.7 22 17Z"
    fill="white"
    opacity="0.9"
  />
</svg>
  </span>
</button>
</div>

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
              className="flex-1 px-3 py-2 border-2 border-black rounded text-base focus:outline-none font-mono"
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