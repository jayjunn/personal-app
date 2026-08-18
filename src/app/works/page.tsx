import React from 'react';
import { Metadata } from 'next';
import WorkList from '../../components/WorkList';
import { getWorks } from '@/service/portfolioService';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Works',
  description:
    'Featured engineering projects and web applications developed by Younggeun Jun.',
};

export default async function WorksPage() {
  const works = await getWorks();

  return (
    <div>
      <WorkList initialWorks={works} />
    </div>
  );
}
