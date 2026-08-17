import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import linkedin from '../../public/image/linkedin.svg';
import github from '../../public/image/github.svg';
import envelope from '../../public/image/envelope.svg';

export default function ContactList() {
  return (
    <section className="w-full flex items-center justify-between px-4 sm:px-8 py-5 border-b-[3px] border-black flex-wrap gap-3 box-border">
      <div className="flex items-center">
        <span className="text-base sm:text-lg font-black uppercase tracking-tight">FIND ME</span>
      </div>
      <div className="hidden md:inline font-mono font-black tracking-widest text-neutral-800">
        <span>{`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`}</span>
      </div>
      <ul className="flex items-center gap-4 sm:gap-5 list-none m-0 p-0">
        <li className="hover:scale-110 transition-transform">
          <Link href="https://github.com/jayjunn" target="_blank" aria-label="GitHub">
            <Image
              src={github}
              alt="github"
              width={36}
              height={36}
              className="w-9 h-9"
            />
          </Link>
        </li>
        <li className="hover:scale-110 transition-transform">
          <Link href="https://www.linkedin.com/in/younggeun" target="_blank" aria-label="LinkedIn">
            <Image src={linkedin} alt="linkedin" width={36} height={36} className="w-9 h-9" />
          </Link>
        </li>
        <li className="hover:scale-110 transition-transform">
          <Link href="mailto:jayjunn@outlook.com" aria-label="Email">
            <Image src={envelope} alt="email" width={36} height={36} className="w-9 h-9" />
          </Link>
        </li>
      </ul>
    </section>
  );
}
