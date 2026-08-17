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

export default function Experience({ limit, showMoreLink = false, initialExperiences }: ExperienceProps) {
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
      moreText={isEnglish ? 'VIEW ALL EXPERIENCES ➔' : '전체 경력 보기 ➔'}>
      <ul className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 list-none p-0">
        {displayedExperiences.map(({ role, company, description, stacks, id }, index) => (
          <li
            className="flex flex-col justify-start items-start p-4 sm:p-5 border-2 border-black bg-[#e7e2d0] shadow-[3px_3px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] transition-all"
            key={`exp-${id || company}-${index}`}
            id={company.toLowerCase().replace(/\s+/g, '-')}>
            <div className="w-full flex items-baseline justify-start mb-3.5 flex-wrap gap-1.5 border-b border-black pb-2">
              <span className="font-extrabold text-sm sm:text-base text-black">{role},</span>
              <span className="font-black text-sm sm:text-base underline underline-offset-4 text-black">
                {company}
              </span>
            </div>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm leading-relaxed font-medium text-black w-full list-none p-0 m-0">
              {languageSelector(description).map((item, dIndex) => (
                <li key={`exp-desc-${company}-${dIndex}`} className="m-0 text-black">
                  <p className="m-0 text-black font-medium">- {item}</p>
                </li>
              ))}
            </ul>
            {stacks && (
              <div className="flex flex-wrap gap-1.5 mt-4 pt-2 border-t border-black/10 w-full">
                {stacks.map((stack, sIdx) => (
                  <span
                    key={`exp-stack-${company}-${stack}-${sIdx}`}
                    className="text-[11px] font-bold border border-black rounded px-2 py-0.5 bg-[#f5f0df] text-black">
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
