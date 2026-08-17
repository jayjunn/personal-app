'use client';

import React from 'react';
import Image from 'next/image';
import TiltCard from './common/TiltCard';

type WorkProps = {
  name: string;
  img: string;
  description: string;
  stacks: string[];
  link: string;
  company?: string;
  priority?: boolean;
};

const Work = (props: WorkProps) => {
  const { name, img, description, stacks, link, company, priority = false } = props;

  const badgeText = (() => {
    if (!company) return null;
    const lower = company.trim().toLowerCase();
    if (lower.includes('toy') || lower.includes('personal') || lower.includes('side')) {
      return 'TOY PROJECT';
    }
    return 'COMPANY';
  })();

  return (
    <TiltCard className="w-full h-full flex flex-col">
      <div
        className="
          w-full
          h-full
          flex
          flex-col
          justify-between
          items-center
          border-[2.5px]
          border-black
          dark:border-[#272a34]
          bg-[#e7e2d0]
          dark:bg-[#16171e]
          rounded-none
          overflow-hidden
          transition-all
          duration-200
          shadow-[4px_4px_0px_#000000]
          hover:shadow-[7px_7px_0px_#000000]
          box-border
        "
        id={name.toLowerCase().replace(/\s+/g, '-')}
      >
        {/* Card Header (Centered Category Label) */}
        <div
          className="
            w-full
            flex
            items-center
            justify-center
            px-4
            sm:px-5
            py-3.5
            border-b-2
            border-black
            dark:border-[#272a34]
            bg-black
            dark:bg-[#1f212a]
            shrink-0
          "
        >
          {badgeText && (
            <span
              className="
                text-xs
                sm:text-sm
                font-mono
                font-black
                uppercase
                tracking-widest
                text-[#e7e2d0]
                dark:text-[#f3f4f6]
              "
            >
              {badgeText}
            </span>
          )}
        </div>

        {/* Image Banner (Box size maintained, inner logo reduced to half size) */}
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="
            w-full
            h-44
            sm:h-52
            relative
            flex
            items-center
            justify-center
            bg-[#e7e2d0]
            dark:bg-[#0d0e12]
            border-b-2
            border-black
            dark:border-[#272a34]
            overflow-hidden
            group
            cursor-pointer
            shrink-0
          "
          aria-label={name}
        >
          <div className="w-1/2 h-1/2 relative flex items-center justify-center">
            <Image
              src={img}
              alt={`${name} logo`}
              fill
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              unoptimized={true}
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 240px"
            />
          </div>
        </a>

        {/* Details & Stacks */}
        <div
          className="
            w-full
            p-5
            sm:p-6
            flex
            flex-col
            justify-between
            flex-1
            gap-4
            bg-[#e7e2d0]
            dark:bg-[#16171e]
          "
        >
          <p className="text-xs sm:text-sm font-medium leading-relaxed text-black dark:text-[#d1d5db] m-0 flex-1">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-black/20 dark:border-white/10">
            {stacks.map((stack, index) => (
              <span
                key={`work-stack-${name}-${stack}-${index}`}
                className="
                  text-[11px]
                  font-extrabold
                  uppercase
                  px-2.5
                  py-1
                  border
                  border-black
                  dark:border-[#2f3340]
                  bg-[#e7e2d0]
                  dark:bg-[#1f212a]
                  shadow-[1px_1px_0px_#000000]
                  text-black
                  dark:text-[#d1d5db]
                "
              >
                {stack}
              </span>
            ))}
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

export default Work;
