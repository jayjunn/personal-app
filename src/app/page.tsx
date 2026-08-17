'use client';

import React from 'react';
import Profile from '../components/Profile';
import WorkList from '../components/WorkList';
import Experience from '../components/Experience';
import ContactList from '../components/ContactList';

export default function HomePage() {
  return (
    <div>
      {/* 1. Profile (Headline, About & Skills) */}
      <Profile />

      {/* 2. Works Preview (2 Featured Projects) */}
      <div id="works-section">
        <WorkList limit={2} showMoreLink={true} />
      </div>

      {/* 3. Experience Preview (2 Recent Companies) */}
      <div id="experiences">
        <Experience limit={2} showMoreLink={true} />
      </div>

      {/* 4. Contact Strip (FIND ME) */}
      <ContactList />
    </div>
  );
}
