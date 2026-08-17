import React from 'react';
import Experience from '@/components/Experience';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Professional Experience & Career History',
  description:
    'Software engineering experience at eBay Japan, Blocko, Glue, and COS. Deep expertise in front-end architecture, performance optimization, and scalable web apps.',
};

export default function ExperiencePage() {
  return <Experience />;
}
