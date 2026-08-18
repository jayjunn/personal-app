import React from 'react';
import { Metadata } from 'next';
import Experience from '../../components/Experience';
import { getExperiences } from '@/service/portfolioService';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Work experience and career timeline of Younggeun Jun (eBay Japan, Blocko, COS).',
};

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div>
      <Experience initialExperiences={experiences} />
    </div>
  );
}
