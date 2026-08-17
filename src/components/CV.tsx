'use client';

import React from 'react';
import { useUserContext } from '../context/userContext';
import { cvData as defaultCv, experienceData, skillCategories } from '../data/portfolioData';
import PageWrap from './common/PageWrap';

export default function Cv() {
  const { isEnglish } = useUserContext();
  const cv = isEnglish ? defaultCv.en : defaultCv.kr;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <PageWrap title="CV">
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
        {/* Print / Download Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handlePrint}
            className="border-[2px] border-black px-6 py-2 bg-black text-[#e7e2d0] font-bold text-sm hover:bg-[#e7e2d0] hover:text-black transition-colors">
            🖨 {isEnglish ? 'Print / Save as PDF' : '이력서 인쇄 / PDF 저장'}
          </button>
        </div>

        {/* CV Box */}
        <div className="border-[3px] border-black bg-[#e7e2d0] p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="border-b-[3px] border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold uppercase">{cv.name}</h1>
              <p className="text-sm font-bold uppercase mt-1">{cv.role}</p>
            </div>
            <div className="text-xs space-y-1 font-semibold">
              <div>Email: {cv.email}</div>
              <div>Location: {cv.location}</div>
              <div>GitHub: github.com/jayjunn</div>
              <div>LinkedIn: linkedin.com/in/younggeun</div>
            </div>
          </div>

          {/* 01. Summary */}
          <div className="space-y-2">
            <h3 className="text-base font-bold border-b-2 border-black pb-1 uppercase">
              {isEnglish ? '01. About & Summary' : '01. 소개'}
            </h3>
            <p className="text-sm font-medium leading-relaxed">{cv.summary}</p>
          </div>

          {/* 02. Skills */}
          <div className="space-y-3">
            <h3 className="text-base font-bold border-b-2 border-black pb-1 uppercase">
              {isEnglish ? '02. Skills & Competencies' : '02. 기술 스택'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {skillCategories.map((cat, idx) => (
                <div key={idx} className="border-2 border-black p-3 bg-[#e7e2d0]">
                  <h4 className="text-xs font-bold uppercase mb-2 border-b border-black pb-1">
                    {isEnglish ? cat.title.en : cat.title.kr}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="text-xs border border-black px-2 py-0.5 font-medium">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 03. Experience */}
          <div className="space-y-4">
            <h3 className="text-base font-bold border-b-2 border-black pb-1 uppercase">
              {isEnglish ? '03. Work History' : '03. 주요 경력'}
            </h3>
            <div className="space-y-4">
              {experienceData.map((item, idx) => {
                const descriptions = isEnglish ? item.description.en : item.description.kr;
                return (
                  <div key={idx} className="border-2 border-black p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black pb-2">
                      <div className="font-bold text-base">
                        {item.role}, {item.company}
                      </div>
                      <div className="text-xs font-semibold">
                        {item.period} | {item.location}
                      </div>
                    </div>
                    <ul className="space-y-1 text-xs sm:text-sm font-medium">
                      {descriptions.map((desc, dIdx) => (
                        <li key={dIdx}>- {desc}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 04. Education */}
          <div className="border-t-2 border-black pt-4">
            <h3 className="text-base font-bold uppercase mb-2">
              {isEnglish ? '04. Education' : '04. 학력'}
            </h3>
            {cv.education.map((edu, idx) => (
              <div key={idx} className="text-xs font-semibold">
                <div>{edu.institution} - {edu.degree}</div>
                <div className="text-stone-700">{edu.period} • {edu.location}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrap>
  );
}
