'use client';

import React from 'react';
import { experienceData as defaultExperienceData } from '../data/portfolioData';
import { ExperienceItem } from '../service/portfolioService';
import { useLanguage } from '@/hooks/useLanguage';
import PageWrap from './common/PageWrap';

interface ExperienceProps {
  limit?: number;
  showMoreLink?: boolean;
  initialExperiences?: ExperienceItem[];
}

export default function Experience({
  limit,
  showMoreLink = false,
  initialExperiences,
}: ExperienceProps) {
  const { isEnglish } = useLanguage();

  const experiences = initialExperiences || defaultExperienceData;
  const displayedExperiences = limit ? experiences.slice(0, limit) : experiences;

  const languageSelector = (description: { en: string[]; kr: string[] }) => {
    if (!description) return [];
    return isEnglish ? description.en || [] : description.kr || [];
  };

  return (
    <PageWrap
      title="Experience"
      moreLink={showMoreLink ? '/experience' : undefined}
      moreText={isEnglish ? 'VIEW ALL EXPERIENCES ➔' : '전체 경력 보기 ➔'}
    >
      <ul className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 list-none p-0">
        {displayedExperiences.map(({ role, company, description, stacks, id }, index) => (
          <li
            className="
              flex
              flex-col
              justify-start
              items-start
              p-5
              sm:p-6
              border-2
              border-black
              dark:border-[#272a34]
              bg-[#e7e2d0]
              dark:bg-[#16171e]
              shadow-[3px_3px_0px_#000000]
              hover:shadow-[5px_5px_0px_#000000]
              transition-all
              gap-4
            "
            key={`exp-${id || company}-${index}`}
            id={company.toLowerCase().replace(/\s+/g, '-')}
          >
            <div className="w-full flex items-baseline justify-start flex-wrap gap-2 border-b border-black dark:border-white/10 pb-3">
              <span className="font-extrabold text-sm sm:text-base text-black dark:text-[#f3f4f6]">{role},</span>
              <span className="font-black text-sm sm:text-base underline underline-offset-4 text-black dark:text-white">
                {company}
              </span>
            </div>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm leading-relaxed font-medium text-black dark:text-[#d1d5db] w-full list-none p-0 m-0">
              {languageSelector(description).map((item, dIndex) => (
                <li key={`exp-desc-${company}-${dIndex}`} className="m-0 text-black dark:text-[#d1d5db]">
                  <p className="m-0 text-black dark:text-[#d1d5db] font-medium">- {item}</p>
                </li>
              ))}
            </ul>
            {stacks && (
              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-black/10 dark:border-white/10 w-full">
                {stacks.map((stack, sIdx) => (
                  <span
                    key={`exp-stack-${company}-${stack}-${sIdx}`}
                    className="
                      text-[11px]
                      font-bold
                      border
                      border-black
                      dark:border-[#2f3340]
                      rounded
                      px-2.5
                      py-1
                      bg-[#f5f0df]
                      dark:bg-[#1f212a]
                      text-black
                      dark:text-[#d1d5db]
                    "
                  >
                    {stack}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </PageWrap>
  );
}
