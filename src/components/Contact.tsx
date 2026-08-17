'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageWrap from './common/PageWrap';
import EmailForm from './EmailForm';
import { useUserContext } from '../context/userContext';
import linkedin from '../../public/image/linkedin.svg';
import github from '../../public/image/github.svg';
import envelope from '../../public/image/envelope.svg';

export default function Contact() {
  const { isEnglish } = useUserContext();

  return (
    <PageWrap title="Contact">
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
        {/* Social Links Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '3px solid black',
            paddingBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
            width: '100%',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase' }}>FIND ME</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, letterSpacing: '2px' }}>{`>>>>>>>>>>>>>>>>`}</span>
          </div>
          <ul style={{ display: 'flex', gap: '18px', margin: 0, padding: 0, listStyle: 'none' }}>
            <li>
              <Link href="https://github.com/jayjunn" target="_blank" aria-label="GitHub">
                <Image src={github} alt="github" width={38} height={38} />
              </Link>
            </li>
            <li>
              <Link href="https://www.linkedin.com/in/younggeun" target="_blank" aria-label="LinkedIn">
                <Image src={linkedin} alt="linkedin" width={38} height={38} />
              </Link>
            </li>
            <li>
              <Link href="mailto:jayjunn@outlook.com" aria-label="Email">
                <Image src={envelope} alt="email" width={38} height={38} />
              </Link>
            </li>
          </ul>
        </div>

        {/* Email Form */}
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 6px 0' }}>
              {isEnglish ? 'Send a Message' : '직접 메시지 보내기'}
            </h3>
            <p style={{ fontSize: '13px', color: '#555', margin: 0, fontWeight: 600 }}>
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
