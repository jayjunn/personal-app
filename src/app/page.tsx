'use client';

import React from 'react';
import Profile from '../components/Profile';
import Experience from '../components/Experience';
import WorkList from '../components/WorkList';
import { SWRConfig } from 'swr';

export default function page() {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
      }}>
      <Profile />
      <Experience />
      <WorkList /> 
    </SWRConfig>
  );
}
