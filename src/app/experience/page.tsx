import React from 'react';
import Experience from '../../components/Experience';
import { getExperiences } from '@/service/portfolioService';

// Next.js ISR (Incremental Static Regeneration)
export const revalidate = 60;

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div>
      <Experience initialExperiences={experiences} />
    </div>
  );
}
