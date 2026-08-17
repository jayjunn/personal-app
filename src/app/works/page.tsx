import React from 'react';
import WorkList from '../../components/WorkList';
import { getWorks } from '@/service/portfolioService';

// Next.js ISR (Incremental Static Regeneration)
export const revalidate = 60;

export default async function WorksPage() {
  const works = await getWorks();

  return (
    <div>
      <WorkList initialWorks={works} />
    </div>
  );
}
