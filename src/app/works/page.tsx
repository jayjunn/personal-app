import React from 'react';
import WorkList from '../../components/WorkList';
import { getWorks } from '@/service/portfolioService';

export const dynamic = 'force-dynamic';

export default async function WorksPage() {
  const works = await getWorks();

  return (
    <div>
      <WorkList initialWorks={works} />
    </div>
  );
}
