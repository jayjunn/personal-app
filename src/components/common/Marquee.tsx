'use client';

import React from 'react';

interface MarqueeProps {
  items?: string[];
  reverse?: boolean;
  className?: string;
  speed?: string;
}

export default function Marquee({
  items = [
    'CREATIVE DEVELOPER',
    'FRONT-END ARCHITECTURE',
    'REACT & NEXT.JS 14+',
    'TYPESCRIPT',
    'HIGH PERFORMANCE UI',
    'INTERACTIVE EXPERIENCES',
    'WEB3 & FINTECH',
    'HLS VIDEO STREAMING',
    'RSPACK MIGRATION',
  ],
  reverse = false,
  className = '',
}: MarqueeProps) {
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className={`overflow-hidden border-y-[3px] border-black bg-black text-[#e7e2d0] py-3 select-none ${className}`}>
      <div className={reverse ? 'animate-marquee-reverse' : 'animate-marquee'}>
        {repeatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center mx-4 gap-4 text-xs md:text-sm font-black tracking-widest uppercase">
            <span>{item}</span>
            <span className="text-[#d4a373] text-base">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
