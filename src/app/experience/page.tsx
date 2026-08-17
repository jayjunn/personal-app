import React from 'react';
import Experience from '../../components/Experience';
import { getExperiences } from '@/service/portfolioService';

export const dynamic = 'force-dynamic';

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div>
      <Experience initialExperiences={experiences} />
    </div>
  );
}
