import React from 'react';
import Cv from '@/components/CV';
import { getCVSettings, getExperiences } from '@/service/portfolioService';

// Next.js ISR (Incremental Static Regeneration)
export const revalidate = 60;

export default async function CvPage() {
  const [cvSettings, experiences] = await Promise.all([
    getCVSettings(),
    getExperiences(),
  ]);

  return (
    <div>
      <Cv initialCv={cvSettings} initialExperiences={experiences} />
    </div>
  );
}
