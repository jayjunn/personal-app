import React from 'react';
import Cv from '@/components/CV';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Curriculum Vitae (CV) & Official Resume',
  description:
    'Full professional CV of Younggeun Jun. Verified background, core technical competencies, education, and career impact summary.',
};

export default function CvPage() {
  return <Cv />;
}
