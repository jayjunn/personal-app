'use client';

import React from 'react';
import Header from '../components/Header';
import Profile from '../components/Profile';
import Experience from '../components/Experience';
import WorkList from '../components/WorkList';

export default function page() {
  return (
    <>
      <Header />
      <Profile />
      <Experience />
      <WorkList />
    </>
  );
}
