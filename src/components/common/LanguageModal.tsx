'use client';

import React from 'react';
import { useUserContext } from '@/context/userContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageModal() {
  const { isLanguageModalOpen, setIsLanguageModalOpen, setLanguage, user } = useUserContext();

  if (!isLanguageModalOpen) return null;

  const handleSelect = (lang: 'ENGLISH' | 'KOREAN') => {
    setLanguage(lang);
    setIsLanguageModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(3px)',
        }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            backgroundColor: '#e7e2d0',
            border: '4px solid #000000',
            padding: '36px 32px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '10px 10px 0px #000000',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'relative',
          }}>
          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '3px solid #000000',
              paddingBottom: '16px',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#000000',
                  display: 'inline-block',
                }}></span>
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: '2px solid #000000',
                  backgroundColor: '#ffffff',
                  display: 'inline-block',
                }}></span>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  marginLeft: '6px',
                }}>
                LANGUAGE SELECTION / 언어 설정
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(false)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontSize: '20px',
                fontWeight: 900,
                lineHeight: 1,
              }}
              title="닫기">
              ✕
            </button>
          </div>

          {/* Title & Description */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 900,
                textTransform: 'uppercase',
                margin: 0,
                letterSpacing: '-0.5px',
              }}>
              SELECT LANGUAGE / 언어 선택
            </h2>
            <p style={{ fontSize: '13px', color: '#444', margin: 0, fontWeight: 600 }}>
              포트폴리오를 둘러보실 기본 언어를 선택해주세요.
            </p>
          </div>

          {/* Language Selection Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* English Option */}
            <button
              type="button"
              onClick={() => handleSelect('ENGLISH')}
              style={{
                all: 'unset',
                cursor: 'pointer',
                boxSizing: 'border-box',
                width: '100%',
                padding: '18px 24px',
                backgroundColor: user.language === 'ENGLISH' ? '#000000' : '#ffffff',
                color: user.language === 'ENGLISH' ? '#e7e2d0' : '#000000',
                border: '3px solid #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                boxShadow: '4px 4px 0px #000000',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '28px' }}>🇬🇧</span>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '2px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase' }}>
                    ENGLISH
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      opacity: 0.8,
                      fontWeight: 600,
                    }}>
                    Browse portfolio & resume in English
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 900 }}>➔</span>
            </button>

            {/* Korean Option */}
            <button
              type="button"
              onClick={() => handleSelect('KOREAN')}
              style={{
                all: 'unset',
                cursor: 'pointer',
                boxSizing: 'border-box',
                width: '100%',
                padding: '18px 24px',
                backgroundColor: user.language === 'KOREAN' ? '#000000' : '#ffffff',
                color: user.language === 'KOREAN' ? '#e7e2d0' : '#000000',
                border: '3px solid #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                boxShadow: '4px 4px 0px #000000',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '28px' }}>🇰🇷</span>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '2px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase' }}>
                    한국어 (KOREAN)
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      opacity: 0.8,
                      fontWeight: 600,
                    }}>
                    프로젝트 설명 및 이력서를 한국어로 보기
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 900 }}>➔</span>
            </button>
          </div>

          {/* Footer Note */}
          <div
            style={{
              borderTop: '2px solid rgba(0, 0, 0, 0.2)',
              paddingTop: '14px',
              textAlign: 'center',
            }}>
            <p style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace', margin: 0 }}>
              * 선택한 언어는 상단 네비게이션의 🌐 지구본 아이콘으로 언제든지 변경할 수 있습니다.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
