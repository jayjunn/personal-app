import React from 'react';
import Profile from '../components/Profile';
import WorkList from '../components/WorkList';
import Experience from '../components/Experience';
import ContactList from '../components/ContactList';
import MarioCompanion from '../components/common/MarioCompanion';
import { getProfile, getWorks, getExperiences } from '../service/portfolioService';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [profile, works, experiences] = await Promise.all([
    getProfile(),
    getWorks(),
    getExperiences(),
  ]);

  return (
    <div>
      {/* 1. Profile (Headline, About & Skills) */}
      <Profile initialProfile={profile} />

      {/* 2. Works Preview (Interactive Swiper Slider with eBay & COS first) */}
      <div id="works-section">
        <WorkList initialWorks={works} useSlider={true} showMoreLink={true} />
      </div>

      {/* 3. Experience Preview (eBay & COS First) */}
      <div id="experiences">
        <Experience initialExperiences={experiences} limit={2} showMoreLink={true} />
      </div>

      {/* 4. Contact Strip (FIND ME) */}
      <div className="border-t-0">
        <ContactList />
      </div>

      {/* 5. Mario Pixel Companion */}
      <MarioCompanion />
    </div>
  );
}
