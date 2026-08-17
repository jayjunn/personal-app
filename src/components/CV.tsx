'use client';

import React from 'react';
import { useUserContext } from '../context/userContext';
import { cvData as defaultCv, experienceData as defaultExperiences, skillCategories } from '../data/portfolioData';
import { CVDataType, ExperienceItem } from '../service/portfolioService';
import PageWrap from './common/PageWrap';

interface CvProps {
  initialCv?: CVDataType;
  initialExperiences?: ExperienceItem[];
}

export default function Cv({ initialCv, initialExperiences }: CvProps) {
  const { isEnglish } = useUserContext();

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
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        {/* Print / Download Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {activeCvData.pdfUrl ? (
            <a
              href={activeCvData.pdfUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                border: '2px solid black',
                padding: '8px 18px',
                backgroundColor: '#ffffff',
                color: 'black',
                fontWeight: 700,
                fontSize: '13px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}>
              📄 {isEnglish ? 'Download PDF Resume ↗' : 'PDF 이력서 다운로드 ↗'}
            </a>
          ) : (
            <div></div>
          )}

          <button
            type="button"
            onClick={handlePrint}
            style={{
              border: '2px solid black',
              padding: '8px 18px',
              backgroundColor: 'black',
              color: '#e7e2d0',
              fontWeight: 700,
              fontSize: '13px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}>
            🖨 {isEnglish ? 'Print / Save as PDF' : '이력서 인쇄 / PDF 저장'}
          </button>
        </div>

        {/* CV Main Box */}
        <div style={{ border: '3px solid black', backgroundColor: '#e7e2d0', padding: '30px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Header */}
          <div style={{ borderBottom: '3px solid black', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>{cv.name}</h1>
              <p style={{ fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', marginTop: '6px' }}>{cv.role}</p>
            </div>
            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', fontWeight: 600, fontFamily: 'monospace' }}>
              <div>Email: {cv.email}</div>
              <div>Location: {cv.location}</div>
              <div>GitHub: github.com/jayjunn</div>
              <div>LinkedIn: linkedin.com/in/younggeun</div>
            </div>
          </div>

          {/* 01. Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, borderBottom: '2px solid black', paddingBottom: '6px', textTransform: 'uppercase' }}>
              {isEnglish ? '01. About & Summary' : '01. 소개'}
            </h3>
            <p style={{ fontSize: '15px', fontWeight: 500, lineHeight: 1.7, margin: 0 }}>{summary}</p>
          </div>

          {/* 02. Skills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, borderBottom: '2px solid black', paddingBottom: '6px', textTransform: 'uppercase' }}>
              {isEnglish ? '02. Skills & Competencies' : '02. 기술 스택'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {skillCategories.map((cat, idx) => (
                <div key={`cv-cat-${cat.title?.en || idx}-${idx}`} style={{ border: '2px solid black', padding: '16px', backgroundColor: '#e7e2d0' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid black', paddingBottom: '4px' }}>
                    {isEnglish ? cat.title.en : cat.title.kr}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {cat.skills.map((skill, sIdx) => (
                      <span key={`cv-skill-${skill.name}-${sIdx}`} style={{ fontSize: '12px', border: '1px solid black', padding: '3px 8px', fontWeight: 600, backgroundColor: '#ffffff' }}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 03. Experience */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, borderBottom: '2px solid black', paddingBottom: '6px', textTransform: 'uppercase' }}>
              {isEnglish ? '03. Work History' : '03. 주요 경력'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {experiences.map((item, idx) => {
                const descriptions = isEnglish
                  ? item.description?.en || []
                  : item.description?.kr || [];
                return (
                  <div key={`cv-exp-${item.company}-${item.id || idx}`} style={{ border: '2px solid black', padding: '18px 20px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid black', paddingBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ fontWeight: 800, fontSize: '16px' }}>
                        {item.role}, {item.company}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' }}>
                        {item.period} | {item.location}
                      </div>
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', lineHeight: 1.6, margin: 0, paddingLeft: 0, listStyle: 'none' }}>
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
          <div style={{ borderTop: '2px solid black', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
              {isEnglish ? '04. Education' : '04. 학력'}
            </h3>
            {cv.education?.map((edu: any, idx: number) => (
              <div key={`cv-edu-${edu.institution || idx}-${idx}`} style={{ fontSize: '13px', fontWeight: 600, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                <div>{edu.institution} - {edu.degree}</div>
                <div style={{ color: '#555' }}>{edu.period} • {edu.location}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrap>
  );
}
