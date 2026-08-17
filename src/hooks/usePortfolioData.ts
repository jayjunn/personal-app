'use client';

import { useState, useEffect } from 'react';
import {
  ProfileDataType,
  CVDataType,
  Project,
  ExperienceItem,
  subscribeToProfile,
  subscribeToExperiences,
  subscribeToWorks,
  subscribeToCVSettings,
} from '@/service/portfolioService';
import {
  profileData as fallbackProfile,
  experienceData as fallbackExperiences,
  workData as fallbackWorks,
  cvData as fallbackCv,
} from '@/data/portfolioData';

export const usePortfolioData = () => {
  const [profile, setProfile] = useState<ProfileDataType>(fallbackProfile as unknown as ProfileDataType);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(fallbackExperiences);
  const [works, setWorks] = useState<Project[]>(fallbackWorks);
  const [cvSettings, setCvSettings] = useState<CVDataType>({
    pdfUrl: '',
    summaryEn: fallbackCv.en.summary,
    summaryKr: fallbackCv.kr.summary,
    lastUpdated: '',
    en: fallbackCv.en,
    kr: fallbackCv.kr,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubs: (() => void)[] = [];

    try {
      const unsubProfile = subscribeToProfile((data) => setProfile(data));
      const unsubExp = subscribeToExperiences((data) => setExperiences(data));
      const unsubWorks = subscribeToWorks((data) => setWorks(data));
      const unsubCv = subscribeToCVSettings((data) => {
        setCvSettings(data);
        setLoading(false);
      });

      unsubs = [unsubProfile, unsubExp, unsubWorks, unsubCv];
    } catch (e) {
      console.error('Error setting up subscriptions:', e);
    }

    return () => {
      unsubs.forEach((unsub) => unsub && unsub());
    };
  }, []);

  return {
    profile,
    experiences,
    works,
    cvSettings,
    loading,
  };
};
