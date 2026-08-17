'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageWrap from './common/PageWrap';
import EmailForm from './EmailForm';
import { useLanguage } from '@/hooks/useLanguage';
import linkedin from '../../public/image/linkedin.svg';
import github from '../../public/image/github.svg';
import envelope from '../../public/image/envelope.svg';

export default function Contact() {
  const { isEnglish } = useLanguage();

  return (
    <PageWrap title="Contact">
      <div className="mt-6 flex flex-col gap-7 w-full">
        {/* Social Links Row */}
        <div className="flex justify-between items-center border-b-[3px] border-black pb-6 flex-wrap gap-4 w-full">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black uppercase">FIND ME</span>
            <span className="hidden md:inline font-mono font-black tracking-widest">{`>>>>>>>>>>>>>>>>`}</span>
          </div>
          <ul className="flex gap-4 sm:gap-5 m-0 p-0 list-none">
            <li className="hover:scale-110 transition-transform">
              <Link href="https://github.com/jayjunn" target="_blank" aria-label="GitHub">
                <Image src={github} alt="github" width={36} height={36} className="w-9 h-9" />
              </Link>
            </li>
            <li className="hover:scale-110 transition-transform">
              <Link href="https://www.linkedin.com/in/younggeun" target="_blank" aria-label="LinkedIn">
                <Image src={linkedin} alt="linkedin" width={36} height={36} className="w-9 h-9" />
              </Link>
            </li>
            <li className="hover:scale-110 transition-transform">
              <Link href="mailto:jayjunn@outlook.com" aria-label="Email">
                <Image src={envelope} alt="email" width={36} height={36} className="w-9 h-9" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Email Form */}
        <div className="w-full">
          <div className="mb-5">
            <h3 className="text-lg sm:text-xl font-black uppercase m-0 mb-1.5">
              {isEnglish ? 'Send a Message' : '직접 메시지 보내기'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 m-0 font-semibold">
              {isEnglish
                ? 'Feel free to reach out for collaborations, project inquiries, or just a friendly hello.'
                : '프로젝트 협업, 문의 사항 또는 인사를 언제든 편하게 남겨주세요.'}
            </p>
          </div>
          <EmailForm />
        </div>
      </div>
    </PageWrap>
  );
}
