import React from 'react';
import WorkList from '@/components/WorkList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Selected Works & Case Studies',
  description:
    'Featured engineering projects by Younggeun Jun spanning enterprise platforms, full stack web apps, Web3 SaaS, and mobile applications.',
};

export default function WorksPage() {
  return <WorkList />;
}
