'use client';

import React from 'react';
import Link from 'next/link';
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
    <PageWrap
      title="Curriculum Vitae"
      subtitle={isEnglish ? 'Professional Background & Verified Competencies' : '공식 이력서 및 상세 경력 기술서'}>
      <div className="py-8 md:py-16 px-6 sm:px-8 max-w-4xl mx-auto space-y-8">
        {/* Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-white border border-stone-300 shadow-sm no-print">
          <div className="flex items-center gap-2">
            <span className="status-pulse" />
            <span className="text-xs font-mono font-medium text-stone-600">
              {isEnglish ? 'Ready for Export & Print' : '공식 이력서 • 인쇄 및 PDF 저장 지원'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-md bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <span>🖨 {isEnglish ? 'Print / PDF' : '인쇄 및 PDF 저장'}</span>
            </button>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-md border border-stone-800 hover:bg-stone-100 text-xs font-semibold text-stone-900 transition-colors">
              <span>{isEnglish ? 'Contact Directly ➔' : '직접 연락하기 ➔'}</span>
            </Link>
          </div>
        </div>

        {/* Printable CV Container */}
        <div className="bg-white rounded-xl border border-stone-300 p-8 sm:p-12 shadow-sm space-y-10">
          {/* Header */}
          <div className="border-b border-stone-200 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
                {cv.title}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-stone-950 mt-1.5">
                {cv.name}
              </h1>
              <p className="text-sm font-mono font-semibold text-stone-600 mt-1">
                {cv.role}
              </p>
            </div>

            <div className="text-xs font-mono text-stone-600 space-y-1 p-3.5 rounded-lg bg-stone-50 border border-stone-200">
              <div>📧 {cv.email}</div>
              <div>📍 {cv.location}</div>
              <div>💻 github.com/jayjunn</div>
              <div>🔗 linkedin.com/in/younggeun</div>
            </div>
          </div>

          {/* 01. Summary */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
              {isEnglish ? '01. Executive Summary' : '01. 개발자 요약'}
            </h3>
            <p className="text-sm sm:text-base text-stone-700 font-normal leading-relaxed">
              {cv.summary}
            </p>
          </div>

          {/* 02. Technical Competencies */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
              {isEnglish ? '02. Technical Competencies' : '02. 기술 역량'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillCategories.map((cat, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <h4 className="text-xs font-mono font-bold text-stone-600 mb-2">
                    {isEnglish ? cat.title.en : cat.title.kr}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 text-xs font-medium bg-white text-stone-800 border border-stone-200 rounded">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 03. Work Experience */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
              {isEnglish ? '03. Professional Work History' : '03. 주요 경력 사항'}
            </h3>
            <div className="space-y-6">
              {experienceData.map((item, idx) => {
                const descriptions = isEnglish ? item.description.en : item.description.kr;
                return (
                  <div key={idx} className="p-5 rounded-lg bg-stone-50 border border-stone-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-2.5">
                      <div>
                        <h4 className="text-base font-bold text-stone-950">{item.company}</h4>
                        <span className="text-xs font-semibold text-stone-700">{item.role}</span>
                      </div>
                      <div className="text-xs font-mono text-stone-500 mt-1 sm:mt-0">
                        {item.period} • {item.location}
                      </div>
                    </div>

                    <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700 font-normal">
                      {descriptions.map((desc, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2 leading-relaxed">
                          <span className="text-stone-900 font-bold">➔</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-200">
                      {item.stacks.map((st, sIdx) => (
                        <span key={sIdx} className="px-1.5 py-0.2 text-[11px] font-mono text-stone-600 bg-white rounded border border-stone-200">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 04. Education & Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-stone-200 pt-6">
            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-3">
                {isEnglish ? 'Education' : '학력'}
              </h3>
              {cv.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-sm text-stone-950">{edu.institution}</h4>
                  <p className="text-xs text-stone-700 mt-0.5">{edu.degree}</p>
                  <p className="text-xs font-mono text-stone-500 mt-1">{edu.period} • {edu.location}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-3">
                {isEnglish ? 'Languages' : '외국어'}
              </h3>
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2 text-xs">
                {cv.languages.map((lang, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="font-semibold text-stone-800">{lang.language}</span>
                    <span className="font-mono text-stone-600">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrap>
  );
}
