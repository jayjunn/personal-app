'use client';

import React, { FormEvent, useState } from 'react';
import { sendContactEmail } from '../app/service/contact';
import Toast from './common/Toast';
import { useUserContext } from '../context/userContext';

export interface IBanner {
  message: string;
  type?: 'success' | 'error';
}

const initialInputValue = {
  email: '',
  subject: '',
  message: '',
};

export default function EmailForm() {
  const { isEnglish } = useUserContext();
  const [inputValue, setInputValue] = useState(initialInputValue);
  const [banner, setBanner] = useState<IBanner | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const presets = [
    { en: '💼 Job / Project Opportunity', kr: '💼 채용 및 프로젝트 제안' },
    { en: '🤝 Technical Collaboration', kr: '🤝 기술 협업 및 자문' },
    { en: '☕ Casual Coffee Chat', kr: '☕ 커피챗 / 네트워킹' },
  ];

  const handlePresetClick = (presetText: string) => {
    setInputValue((prev) => ({ ...prev, subject: presetText }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    sendContactEmail(inputValue)
      .then(() => {
        setBanner({
          message: isEnglish ? 'Message sent successfully! I will reply shortly.' : '이메일이 성공적으로 전송되었습니다! 곧 회신드리겠습니다.',
          type: 'success',
        });
        setInputValue(initialInputValue);
      })
      .catch(() => {
        setBanner({
          message: isEnglish ? 'Failed to send message. Please email me directly at jayjunn@outlook.com.' : '메일 전송에 실패했습니다. jayjunn@outlook.com 으로 직접 보내주세요.',
          type: 'error',
        });
      })
      .finally(() => {
        setTimeout(() => setBanner(null), 5000);
        setIsLoading(false);
      });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 sm:p-8 rounded-xl bg-white border border-stone-300 shadow-sm relative">
      {banner && <Toast message={banner.message} />}

      <div className="border-b border-stone-200 pb-4 mb-6">
        <h3 className="text-lg font-bold text-stone-950">
          {isEnglish ? 'Send an Inquiry' : '온라인 메시지 보내기'}
        </h3>
        <p className="text-xs text-stone-500 font-normal mt-1">
          {isEnglish ? 'Fill out the form below to reach me directly.' : '아래 양식을 작성하시면 제 메일함으로 즉시 전달됩니다.'}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} method="POST">
        {/* Presets */}
        <div>
          <label className="text-xs font-mono font-bold uppercase text-stone-500 block mb-2">
            {isEnglish ? 'Quick Subject Presets' : '빠른 주제 선택'}
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, idx) => {
              const text = isEnglish ? preset.en : preset.kr;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handlePresetClick(text)}
                  className="text-xs font-medium px-3 py-1 rounded bg-stone-100 border border-stone-200 hover:bg-stone-200 transition-colors text-stone-800">
                  {text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1" htmlFor="email">
            {isEnglish ? 'Your Email *' : '보내시는 분 이메일 *'}
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="name@company.com"
            value={inputValue.email}
            onChange={handleInput}
            className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 placeholder-stone-400"
          />
        </div>

        {/* Subject Field */}
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1" htmlFor="subject">
            {isEnglish ? 'Subject *' : '제목 *'}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            placeholder={isEnglish ? 'E.g. Frontend Engineer Opportunity' : '예: 프론트엔드 포지션 제안'}
            value={inputValue.subject}
            onChange={handleInput}
            className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 placeholder-stone-400"
          />
        </div>

        {/* Message Field */}
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1" htmlFor="message">
            {isEnglish ? 'Message *' : '메시지 내용 *'}
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            required
            placeholder={isEnglish ? 'Write your message here...' : '남기실 내용을 작성해주세요...'}
            value={inputValue.message}
            onChange={handleInput}
            className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 placeholder-stone-400 resize-y"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="brutal-btn text-xs py-2.5 px-6">
            <span>{isLoading ? (isEnglish ? 'Sending...' : '전송 중...') : (isEnglish ? 'Send Message ➔' : '메시지 전송하기 ➔')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
