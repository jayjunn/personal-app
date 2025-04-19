'use client';

import React from 'react';
import { useUserContext } from '../context/userContext';
import PageWrap from './common/PageWrap';
import styles from '../app/styles/Cv.module.css';

export default function Cv() {
  const { isEnglish } = useUserContext();

  const handleExperienceClick = (company: string) => {
    document.getElementById(`${company.toLocaleLowerCase()}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const languageSelector = (description: { en: string[]; kr: string[] }) => {
    return isEnglish ? description.en : description.kr;
  };

  return (
    <PageWrap title="CV">
      <div className="px-4 h-full flex flex-col items-center justify-start my-20">
        <div className="text-xs">CV DOWNLOAD</div>
        <span className="text-xs">coming soon...</span>
      </div>
    </PageWrap>
  );
}
