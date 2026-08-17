import React from 'react';
import Cv from '@/components/CV';
import { getCVSettings, getExperiences } from '@/service/portfolioService';

export const dynamic = 'force-dynamic';

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
