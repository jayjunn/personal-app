'use client';

import React from 'react';
import Profile from '../components/Profile';
import Experience from '../components/Experience';
import WorkList from '../components/WorkList';

export default function page() {
  return (
    <>
      <Profile />
      <Experience />
      <WorkList />
    </>
  );
}
