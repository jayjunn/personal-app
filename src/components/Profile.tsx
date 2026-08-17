'use client';

import React from 'react';
import anglesRight from '../../public/image/anglesRight.svg';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { profileData as defaultProfileData } from '../data/portfolioData';
import { ProfileDataType } from '../service/portfolioService';
import { motion } from 'framer-motion';

interface ProfileProps {
  initialProfile?: ProfileDataType;
}

const Profile = ({ initialProfile }: ProfileProps) => {
  const handleScrollDown = () => {
    document.getElementById('works-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const { isEnglish } = useLanguage();

  const activeData = initialProfile || (defaultProfileData as unknown as ProfileDataType);
  const profile = isEnglish ? activeData.en : activeData.kr;

  const defaultSkills = [
    'REACT',
    'NEXT.JS',
    'TYPESCRIPT',
    'JAVASCRIPT',
    'TAILWINDCSS',
    'NODE.JS',
    'GIT',
    'HTML5 / CSS3',
    'RSPACK',
    'GRAPHQL',
    'REACT NATIVE',
  ];

  const skills = profile.skills && profile.skills.length > 0 ? profile.skills : defaultSkills;

  return (
    <section className="w-full flex flex-col md:flex-row items-stretch border-b-[3px] border-black box-border">
      {/* Left Column: Headline & About */}
      <div className="flex-1 py-5 flex flex-col border-b-[3px] md:border-b-0 md:border-r-[3px] border-black group">
        <p className="p-5 sm:p-7 md:p-8 uppercase text-lg sm:text-xl font-black leading-snug m-0 text-black">
          {profile.headLine}
        </p>
        <div className="border-t-[3px] border-black flex-grow flex flex-col">
          <div className="border-b-[3px] border-black px-5 sm:px-8 py-4 sm:py-6 flex items-center gap-2.5">
            <Image
              className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90"
              src={anglesRight}
              alt="icon"
              width={30}
              height={30}
            />
            <span className="font-extrabold tracking-tight text-lg uppercase text-black">ABOUT</span>
          </div>
          <div className="text-sm sm:text-base leading-relaxed font-medium p-5 sm:p-8 text-black">
            {profile.about}
          </div>
        </div>
      </div>

      {/* Right Column: Skills & Scroll Arrow */}
      <div className="flex-1 py-5 flex flex-col justify-between">
        <div className="group">
          <div className="px-4 sm:px-8">
            <div className="bg-black text-[#e7e2d0] flex items-center h-14 sm:h-16 gap-3 px-4 sm:px-6">
              <Image
                className="w-5 h-5 invert-[93%] sepia-[8%] saturate-[339%] hue-rotate-[10deg] brightness-[98%] contrast-[90%] transition-transform duration-300 group-hover:rotate-90"
                src={anglesRight}
                alt="icon"
                width={20}
                height={20}
              />
              <h3 className="font-extrabold text-base sm:text-lg uppercase tracking-tight text-[#e7e2d0] m-0">
                {isEnglish ? 'SKILLS' : '기술 스택'}
              </h3>
            </div>
          </div>

          <div className="px-4 sm:px-8 border-b-[3px] border-black">
            <div className="py-5 sm:py-7 flex flex-wrap gap-2 sm:gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={`profile-skill-${skill}-${index}`}
                  className="border-2 border-black rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-extrabold tracking-wide bg-[#e7e2d0] text-black shadow-[2px_2px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] hover:bg-[#d4ceb8] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-default"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}>
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Down Button */}
        <div className="py-6 flex justify-center items-center">
          <button
            onClick={handleScrollDown}
            className="cursor-pointer rotate-90 hover:scale-125 transition-transform"
            aria-label="Scroll to Works">
            <Image src={anglesRight} alt="scroll down" width={36} height={36} className="w-9 h-9" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
