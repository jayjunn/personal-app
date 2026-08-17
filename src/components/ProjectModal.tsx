'use client';

import React from 'react';
import Image from 'next/image';
import { Project } from '../data/portfolioData';
import { useUserContext } from '../context/userContext';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { isEnglish } = useUserContext();

  if (!project) return null;

  const desc = isEnglish ? project.description.en : project.description.kr;
  const fullDesc = project.fullDescription
    ? isEnglish
      ? project.fullDescription.en
      : project.fullDescription.kr
    : desc;
  const features = project.keyFeatures
    ? isEnglish
      ? project.keyFeatures.en
      : project.keyFeatures.kr
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}>
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-stone-800 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
              <span className="font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                {project.company || 'Project'}
              </span>
              <span>•</span>
              <span>{project.period || '2023'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-950 mt-1.5">{project.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm flex items-center justify-center transition-colors"
            title="Close">
            ✕
          </button>
        </div>

        {/* Project Image */}
        <div className="my-5 rounded-lg border border-stone-200 overflow-hidden bg-stone-100 relative aspect-video flex items-center justify-center">
          <Image
            src={project.img}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </div>

        {/* Description & Overview */}
        <div className="space-y-4 text-stone-800">
          <p className="text-sm sm:text-base font-normal leading-relaxed text-stone-700">{fullDesc}</p>

          {/* Key Features */}
          {features.length > 0 && (
            <div className="border-t border-stone-200 pt-4 mt-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 mb-2.5">
                {isEnglish ? 'Engineering Highlights' : '주요 개발 및 구현 내용'}
              </h4>
              <ul className="space-y-2">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700 font-normal">
                    <span className="text-stone-900 font-bold">➔</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Badges */}
          <div className="border-t border-stone-200 pt-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2">
              {isEnglish ? 'Tech Stack' : '사용 기술'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.stacks.map((stack, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs font-mono font-medium rounded bg-stone-100 text-stone-800 border border-stone-200">
                  {stack}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap gap-3 pt-5 border-t border-stone-200">
            {project.link && project.link !== '/' && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 rounded-lg bg-stone-900 text-white font-semibold text-xs sm:text-sm text-center hover:bg-stone-800 transition-colors">
                <span>{isEnglish ? 'Open Live Project ↗' : '라이브 사이트 바로가기 ↗'}</span>
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 rounded-lg border border-stone-800 text-stone-900 font-semibold text-xs sm:text-sm text-center hover:bg-stone-100 transition-colors">
                <span>{isEnglish ? 'GitHub Repository ↗' : 'GitHub 소스 코드 ↗'}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
