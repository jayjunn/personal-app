import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import anglesRight from '../../../public/image/anglesRight.svg';

interface IPageWrap {
  title: string;
  moreLink?: string;
  moreText?: string;
  children: React.ReactNode;
}

export default function PageWrap({ title, moreLink, moreText = 'VIEW ALL ➔', children }: IPageWrap) {
  return (
    <section className="w-full flex flex-col p-4 sm:p-6 md:p-8 border-b-[3px] border-black box-border group">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center cursor-pointer">
          <Image
            className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 ease-out group-hover:rotate-90"
            src={anglesRight}
            alt="icon"
            width={30}
            height={30}
          />
          <h2 className="ml-2 sm:ml-3 text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-black m-0">
            {title}
          </h2>
        </div>
        {moreLink && (
          <Link
            href={moreLink}
            className="inline-flex items-center px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-black text-[#e7e2d0] border-2 border-black font-extrabold text-[11px] sm:text-xs uppercase hover:bg-[#e7e2d0] hover:text-black transition-colors shadow-[2px_2px_0px_#000000]">
            {moreText}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
