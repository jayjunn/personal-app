'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { cvData as defaultCv, experienceData as defaultExperiences, skillCategories } from '../data/portfolioData';
import { CVDataType, ExperienceItem } from '../service/portfolioService';
import PageWrap from './common/PageWrap';

interface CvProps {
  initialCv?: CVDataType;
  initialExperiences?: ExperienceItem[];
}

export default function Cv({ initialCv, initialExperiences }: CvProps) {
  const { isEnglish } = useLanguage();

  const activeCvData = initialCv || {};
  const cv = isEnglish
    ? activeCvData.en || defaultCv.en
    : activeCvData.kr || defaultCv.kr;

  const summary = isEnglish
    ? activeCvData.summaryEn || cv.summary
    : activeCvData.summaryKr || cv.summary;

  const experiences = initialExperiences || defaultExperiences;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <PageWrap title="CV">
      <div className="flex flex-col gap-6 w-full">
        {/* Print / Download Button */}
        <div className="flex justify-between items-center flex-wrap gap-3 w-full">
          {activeCvData.pdfUrl ? (
            <a
              href={activeCvData.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="border-2 border-black px-4 py-2 bg-[#e7e2d0] text-black font-bold text-xs sm:text-sm uppercase no-underline inline-flex items-center gap-1.5 hover:bg-black hover:text-[#e7e2d0] transition-colors shadow-[2px_2px_0px_#000000]">
              📄 {isEnglish ? 'Download PDF Resume ↗' : 'PDF 이력서 다운로드 ↗'}
            </a>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="border-2 border-black px-4 py-2 bg-black text-[#e7e2d0] font-bold text-xs sm:text-sm uppercase cursor-pointer inline-flex items-center gap-1.5 hover:bg-neutral-800 transition-colors shadow-[2px_2px_0px_#000000]">
            🖨 {isEnglish ? 'Print / Save as PDF' : '이력서 인쇄 / PDF 저장'}
          </button>
        </div>

        {/* CV Main Box */}
        <div className="border-[3px] border-black bg-[#e7e2d0] p-5 sm:p-7 md:p-8 flex flex-col gap-7 sm:gap-8 w-full box-border shadow-[4px_4px_0px_#000000]">
          {/* Header */}
          <div className="border-b-[3px] border-black pb-5 flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase m-0 tracking-tight">{cv.name}</h1>
              <p className="text-xs sm:text-sm font-bold uppercase mt-1 text-neutral-800">{cv.role}</p>
            </div>
            <div className="text-xs flex flex-col gap-1 font-semibold font-mono text-neutral-800">
              <div>Email: {cv.email}</div>
              <div>Location: {cv.location}</div>
              <div>GitHub: github.com/jayjunn</div>
              <div>LinkedIn: linkedin.com/in/younggeun</div>
            </div>
          </div>

          {/* 01. Summary */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm sm:text-base font-black border-b-2 border-black pb-2 uppercase">
              {isEnglish ? '01. About & Summary' : '01. 소개'}
            </h3>
            <p className="text-xs sm:text-sm font-medium leading-relaxed m-0 text-neutral-800">{summary}</p>
          </div>

          {/* 02. Skills */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm sm:text-base font-black border-b-2 border-black pb-2 uppercase">
              {isEnglish ? '02. Skills & Competencies' : '02. 기술 스택'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {skillCategories.map((cat, idx) => (
                <div key={`cv-cat-${cat.title?.en || idx}-${idx}`} className="border-2 border-black p-5 bg-[#e7e2d0] shadow-[2px_2px_0px_#000000]">
                  <h4 className="text-xs font-black uppercase mb-3 border-b border-black pb-1.5">
                    {isEnglish ? cat.title.en : cat.title.kr}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, sIdx) => (
                      <span key={`cv-skill-${skill.name}-${sIdx}`} className="text-[11px] border border-black px-2.5 py-1 font-bold bg-[#e7e2d0] shadow-[1px_1px_0px_#000000]">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 03. Experience */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm sm:text-base font-black border-b-2 border-black pb-2 uppercase">
              {isEnglish ? '03. Work History' : '03. 주요 경력'}
            </h3>
            <div className="flex flex-col gap-5">
              {experiences.map((item, idx) => {
                const descriptions = isEnglish
                  ? item.description?.en || []
                  : item.description?.kr || [];
                return (
                  <div key={`cv-exp-${item.company}-${item.id || idx}`} className="border-2 border-black p-5 sm:p-6 bg-[#e7e2d0] flex flex-col gap-3 shadow-[2px_2px_0px_#000000]">
                    <div className="flex justify-between items-center border-b border-black pb-3 flex-wrap gap-2">
                      <div className="font-extrabold text-sm sm:text-base">
                        {item.role}, {item.company}
                      </div>
                      <div className="text-xs font-bold font-mono text-neutral-600">
                        {item.period} | {item.location}
                      </div>
                    </div>
                    <ul className="flex flex-col gap-2 text-xs sm:text-sm leading-relaxed m-0 pl-0 list-none text-neutral-800">
                      {descriptions.map((desc, dIdx) => (
                        <li key={`cv-desc-${item.company}-${dIdx}`}>- {desc}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 04. Education */}
          <div className="border-t-2 border-black pt-5 flex flex-col gap-3">
            <h3 className="text-sm sm:text-base font-black uppercase m-0">
              {isEnglish ? '04. Education' : '04. 학력'}
            </h3>
            {cv.education?.map((edu: any, idx: number) => (
              <div key={`cv-edu-${edu.institution || idx}-${idx}`} className="text-xs sm:text-sm font-semibold flex justify-between flex-wrap gap-1">
                <div>{edu.institution} - {edu.degree}</div>
                <div className="text-neutral-600 font-mono">{edu.period} • {edu.location}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrap>
  );
}
