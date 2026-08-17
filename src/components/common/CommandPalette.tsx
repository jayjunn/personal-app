'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/providers/ThemeProvider';

interface CommandItem {
  id: string;
  category: 'navigation' | 'actions' | 'social';
  titleEn: string;
  titleKr: string;
  subtitleEn?: string;
  subtitleKr?: string;
  icon: string;
  shortcut?: string;
  action: () => void;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { isEnglish, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-home',
        category: 'navigation',
        titleEn: 'Home',
        titleKr: '홈 (Home)',
        subtitleEn: 'Go to overview & hero',
        subtitleKr: '메인 페이지로 이동',
        icon: '🏠',
        action: () => router.push('/'),
      },
      {
        id: 'nav-works',
        category: 'navigation',
        titleEn: 'Works & Projects',
        titleKr: '프로젝트 목록 (Works)',
        subtitleEn: 'Explore all featured projects',
        subtitleKr: '전체 프로젝트 탐색',
        icon: '💼',
        action: () => router.push('/works'),
      },
      {
        id: 'nav-experience',
        category: 'navigation',
        titleEn: 'Experience & History',
        titleKr: '경력 사항 (Experience)',
        subtitleEn: 'eBay Japan, COS, Glue, Blocko',
        subtitleKr: '회사별 업무 이력 및 기술 스택',
        icon: '🏢',
        action: () => router.push('/experience'),
      },
      {
        id: 'nav-cv',
        category: 'navigation',
        titleEn: 'Curriculum Vitae (CV)',
        titleKr: '이력서 보기 (CV)',
        subtitleEn: 'Interactive resume & print',
        subtitleKr: '상세 이력서 및 PDF 저장',
        icon: '📄',
        action: () => router.push('/cv'),
      },
      {
        id: 'nav-contact',
        category: 'navigation',
        titleEn: 'Contact Me',
        titleKr: '연락처 (Contact)',
        subtitleEn: 'Send direct message or email',
        subtitleKr: '메시지 전송 및 이메일 문의',
        icon: '📬',
        action: () => router.push('/contact'),
      },
      {
        id: 'nav-admin',
        category: 'navigation',
        titleEn: 'Admin Panel',
        titleKr: '관리자 패널 (Admin)',
        subtitleEn: 'Content management CMS',
        subtitleKr: '포트폴리오 데이터 편집',
        icon: '🔒',
        action: () => router.push('/admin'),
      },

      // Quick Actions
      {
        id: 'action-theme',
        category: 'actions',
        titleEn: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        titleKr: isDark ? '라이트 모드로 전환' : '다크 모드로 전환',
        subtitleEn: isDark ? 'Warm beige aesthetic' : 'Matte charcoal aesthetic',
        subtitleKr: isDark ? '밝은 베이지 테마' : '다크 네오 브루탈리즘 테마',
        icon: isDark ? '☀️' : '🌙',
        shortcut: 'T',
        action: () => toggleTheme(),
      },
      {
        id: 'action-language',
        category: 'actions',
        titleEn: isEnglish ? 'Switch to Korean (한국어)' : 'Switch to English',
        titleKr: isEnglish ? '한국어로 전환 (KR)' : '영문으로 전환 (EN)',
        subtitleEn: 'Instant zero-flicker bilingual mode',
        subtitleKr: '즉시 다국어 전환',
        icon: '🌐',
        shortcut: 'L',
        action: () => toggleLanguage(),
      },

      // Social & Links
      {
        id: 'social-github',
        category: 'social',
        titleEn: 'GitHub Profile',
        titleKr: '깃허브 프로필 (GitHub)',
        subtitleEn: 'github.com/jayjunn',
        subtitleKr: '오픈소스 및 프로젝트 저장소',
        icon: '🐙',
        action: () => window.open('https://github.com/jayjunn', '_blank'),
      },
      {
        id: 'social-linkedin',
        category: 'social',
        titleEn: 'LinkedIn Profile',
        titleKr: '링크드인 (LinkedIn)',
        subtitleEn: 'linkedin.com/in/younggeun',
        subtitleKr: '커리어 네트워크 연결',
        icon: '💼',
        action: () =>
          window.open('https://www.linkedin.com/in/younggeun', '_blank'),
      },
      {
        id: 'social-email',
        category: 'social',
        titleEn: 'Send Email Directly',
        titleKr: '이메일 바로 쓰기',
        subtitleEn: 'jayjunn@outlook.com',
        subtitleKr: '클라이언트 메일 앱 열기',
        icon: '✉️',
        action: () => window.open('mailto:jayjunn@outlook.com', '_blank'),
      },
    ],
    [router, isEnglish, isDark, toggleLanguage, toggleTheme]
  );

  // Filter commands by search term
  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;
    const q = search.toLowerCase();
    return commands.filter(
      (c) =>
        c.titleEn.toLowerCase().includes(q) ||
        c.titleKr.toLowerCase().includes(q) ||
        (c.subtitleEn && c.subtitleEn.toLowerCase().includes(q)) ||
        (c.subtitleKr && c.subtitleKr.toLowerCase().includes(q))
    );
  }, [commands, search]);

  // Global Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setSearch('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
          }
          return !prev;
        });
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, []);

  const handleSelectCommand = (item: CommandItem) => {
    setIsOpen(false);
    setSearch('');
    item.action();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredCommands.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? filteredCommands.length - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredCommands[selectedIndex];
      if (current) {
        handleSelectCommand(current);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="
            fixed
            inset-0
            z-[999999]
            bg-black/70
            backdrop-blur-sm
            flex
            items-start
            justify-center
            pt-[12vh]
            px-4
            cursor-pointer
          "
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
            className="
              w-full
              max-w-xl
              bg-[#e7e2d0]
              dark:bg-[#16171e]
              border-4
              border-black
              dark:border-[#272a34]
              shadow-[8px_8px_0px_#000000]
              flex
              flex-col
              overflow-hidden
              cursor-default
            "
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b-[3px] border-black dark:border-[#272a34] bg-black/5 dark:bg-white/5">
              <span className="text-lg">⚡</span>
              <input
                ref={inputRef}
                type="text"
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder={
                  isEnglish
                    ? 'Type a command or search (e.g. works, theme, github)...'
                    : '명령어 또는 페이지 검색 (예: works, 다크모드, github)...'
                }
                className="
                  flex-1
                  bg-transparent
                  border-none
                  outline-none
                  text-sm
                  sm:text-base
                  font-mono
                  font-bold
                  text-black
                  dark:text-[#f3f4f6]
                  placeholder:text-neutral-500
                "
              />
              <span className="text-[10px] font-mono font-black border border-black dark:border-[#2f3340] px-1.5 py-0.5 bg-[#e7e2d0] dark:bg-[#1f212a] text-black dark:text-[#d1d5db]">
                ESC
              </span>
            </div>

            {/* Command List */}
            <div className="max-h-[380px] overflow-y-auto p-2 flex flex-col gap-1 select-none">
              {filteredCommands.map((item, index) => {
                const isSelected = index === selectedIndex;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectCommand(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`
                      flex
                      items-center
                      justify-between
                      gap-3
                      px-3.5
                      py-2.5
                      border-2
                      transition-colors
                      cursor-pointer
                      ${
                        isSelected
                          ? 'border-black dark:border-white bg-black text-[#e7e2d0] dark:bg-white dark:text-black shadow-[3px_3px_0px_#000000]'
                          : 'border-transparent text-black dark:text-[#f3f4f6] hover:bg-black/5 dark:hover:bg-white/5'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg shrink-0">{item.icon}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs sm:text-sm font-black font-mono tracking-tight truncate">
                          {isEnglish ? item.titleEn : item.titleKr}
                        </span>
                        <span
                          className={`
                            text-[11px]
                            font-mono
                            truncate
                            ${
                              isSelected
                                ? 'text-neutral-300 dark:text-neutral-900'
                                : 'text-neutral-600 dark:text-neutral-400'
                            }
                          `}
                        >
                          {isEnglish ? item.subtitleEn : item.subtitleKr}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                      {item.shortcut && (
                        <span className="border border-current px-1.5 py-0.5 font-bold uppercase">
                          {item.shortcut}
                        </span>
                      )}
                      {isSelected && <span className="font-bold">↵ ENTER</span>}
                    </div>
                  </div>
                );
              })}

              {filteredCommands.length === 0 && (
                <div className="py-8 text-center text-xs font-mono font-bold text-neutral-500">
                  {isEnglish
                    ? `No commands found matching "${search}"`
                    : `"${search}" 검색 결과가 없습니다.`}
                </div>
              )}
            </div>

            {/* Footer Quick Keys */}
            <div className="px-4 py-2 border-t-2 border-black dark:border-[#272a34] bg-black/5 dark:bg-white/5 flex items-center justify-between text-[10px] font-mono font-bold text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <span className="uppercase">Younggeun Jun • Dev Spotlight</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
