import React from 'react';
import { Metadata } from 'next';
import Cv from '@/components/CV';
import { getCVSettings, getExperiences } from '@/service/portfolioService';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CV',
  description:
    'Curriculum Vitae and professional qualifications of Younggeun Jun.',
};

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
