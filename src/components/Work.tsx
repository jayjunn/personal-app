'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

  return (
    <motion.div
      className="w-full flex flex-col justify-start items-center border-[2.5px] border-black bg-[#e7e2d0] rounded-none overflow-hidden transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] box-border"
      id={company ? company.toLowerCase().replace(/\s+/g, '-') : name.toLowerCase().replace(/\s+/g, '-')}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}>
      {/* Card Header */}
      <div className="w-full flex items-center justify-between px-4 py-3 border-b-2 border-black bg-black text-[#e7e2d0] font-black text-sm uppercase tracking-tight">
        <span>{name}</span>
        {company && (
          <span className="text-[11px] font-mono font-bold bg-[#e7e2d0] text-black px-2 py-0.5 border border-black">
            {company}
          </span>
        )}
      </div>

      {/* Image Banner */}
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="w-full h-44 sm:h-52 relative block bg-white border-b-2 border-black overflow-hidden group cursor-pointer"
        aria-label={name}>
        <div className="w-full h-full relative p-4 flex items-center justify-center">
          <Image
            src={img}
            alt={`${name} logo`}
            fill
            priority={priority}
            unoptimized={true}
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 450px"
          />
        </div>
      </a>

      {/* Details & Stacks */}
      <div className="w-full p-4 sm:p-5 flex flex-col justify-between flex-grow gap-3 bg-[#e7e2d0]">
        <p className="text-xs sm:text-sm font-medium leading-relaxed text-neutral-900 m-0">
          {description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-black/20">
          {stacks.map((stack, index) => (
            <span
              key={`work-stack-${name}-${stack}-${index}`}
              className="text-[11px] font-extrabold uppercase px-2 py-0.5 border border-black bg-white shadow-[1px_1px_0px_#000000]">
              {stack}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Work;
