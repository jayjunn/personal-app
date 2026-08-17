import React from 'react';
import Link from 'next/link';
import { AnglesRightIcon } from '@/components/icons';

interface IPageWrap {
  title: string;
  moreLink?: string;
  moreText?: string;
  children: React.ReactNode;
}

export default function PageWrap({
  title,
  moreLink,
  moreText = 'VIEW ALL ➔',
  children,
}: IPageWrap) {
  return (
    <section className="w-full flex flex-col gap-6 sm:gap-8 p-4 sm:p-6 md:p-8 border-b-[3px] border-black dark:border-[#272a34] box-border group transition-colors duration-200">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center cursor-pointer">
          <AnglesRightIcon className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 ease-out group-hover:rotate-90 stroke-current text-black dark:text-[#f3f4f6]" />
          <h2 className="ml-2 sm:ml-3 text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-black dark:text-[#f3f4f6] m-0">
            {title}
          </h2>
        </div>
        {moreLink && (
          <Link
            href={moreLink}
            className="
              inline-flex
              items-center
              px-3
              sm:px-4
              py-1.5
              sm:py-2
              bg-black
              dark:bg-white
              text-[#e7e2d0]
              dark:text-black
              border-2
              border-black
              dark:border-white
              font-extrabold
              text-[11px]
              sm:text-xs
              uppercase
              hover:bg-[#e7e2d0]
              hover:text-black
              dark:hover:bg-neutral-200
              transition-colors
              shadow-[2px_2px_0px_#000000]
            "
          >
            {moreText}
          </Link>
        )}
      </div>
      {section_children_wrapper(children)}
    </section>
  );
}

function section_children_wrapper(children: React.ReactNode) {
  return children;
}
