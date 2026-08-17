'use client';

import React, { FormEvent, useState } from 'react';
import { sendContactEmail } from '../app/service/contact';
import Toast from './common/Toast';

export interface IBanner {
  message: string;
}
const initialInputValue = {
  email: '',
  subject: '',
  message: '',
};

export default function EmailForm() {
  const [inputValue, setInputValue] = useState(initialInputValue);
  const [banner, setBanner] = useState<IBanner | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    sendContactEmail(inputValue)
      .then(() => {
        setBanner({
          message: '이메일이 성공적으로 전송되었습니다! ✅',
        });
        setInputValue(initialInputValue);
      })
      .catch(() => {
        setBanner({
          message: '이메일 전송에 실패했습니다. 다시 시도해주세요.',
        });
      })
      .finally(() => {
        setTimeout(() => setBanner(null), 3500);
        setIsLoading(false);
      });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {banner && <Toast message={banner.message} />}
      <form
        onSubmit={handleSubmit}
        method="POST"
        style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              htmlFor="email"
              style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#111' }}>
              이메일 주소 (Email Address)
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="your-email@example.com"
              onChange={handleInput}
              value={inputValue.email}
              style={{
                boxSizing: 'border-box',
                width: '100%',
                padding: '14px 16px',
                backgroundColor: '#ffffff',
                border: '2px solid #000000',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              htmlFor="subject"
              style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#111' }}>
              제목 (Subject)
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              required
              placeholder="프로젝트 제안 / 문의 내용"
              onChange={handleInput}
              value={inputValue.subject}
              style={{
                boxSizing: 'border-box',
                width: '100%',
                padding: '14px 16px',
                backgroundColor: '#ffffff',
                border: '2px solid #000000',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <label
            htmlFor="message"
            style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#111' }}>
            메시지 본문 (Message)
          </label>
          <textarea
            name="message"
            id="message"
            required
            rows={5}
            placeholder="남기실 메시지를 작성해주세요..."
            onChange={handleInput}
            value={inputValue.message}
            style={{
              boxSizing: 'border-box',
              width: '100%',
              padding: '14px 16px',
              backgroundColor: '#ffffff',
              border: '2px solid #000000',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'inherit',
              outline: 'none',
              lineHeight: 1.6,
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', width: '100%' }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              all: 'unset',
              cursor: 'pointer',
              boxSizing: 'border-box',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#000000',
              color: '#e7e2d0',
              border: '2px solid #000000',
              padding: '14px 32px',
              fontSize: '14px',
              fontWeight: 800,
              textTransform: 'uppercase',
              transition: 'all 0.2s ease',
              opacity: isLoading ? 0.6 : 1,
              width: '100%',
            }}>
            {isLoading ? '전송 처리 중...' : '메시지 전송 (Send Message) ➔'}
          </button>
        </div>
      </form>
    </>
  );
}
