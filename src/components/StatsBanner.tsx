'use client';

import React from 'react';
import { useUserContext } from '../context/userContext';
import { profileData } from '../data/portfolioData';

export default function StatsBanner() {
  const { isEnglish } = useUserContext();
  const profile = isEnglish ? profileData.en : profileData.kr;

  return (
    <section className="border-b-[3px] border-black bg-[#f2eee0] p-6 md:p-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {profile.stats.map((stat, index) => (
          <div
            key={index}
            className="border-2 border-black bg-[#e7e2d0] p-5 shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] transition-all flex flex-col justify-between">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl md:text-5xl font-black tracking-tighter text-black">
                {stat.value}
              </span>
              <span className="text-xs font-mono font-bold bg-black text-[#e7e2d0] px-2 py-0.5">
                0{index + 1}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t-2 border-black">
              <h4 className="font-bold text-sm md:text-base uppercase tracking-tight text-black">
                {stat.label}
              </h4>
              <p className="text-xs text-stone-600 mt-1 font-medium">
                {stat.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
