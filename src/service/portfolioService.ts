import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import {
  profileData as initialProfileData,
  experienceData as initialExperienceData,
  workData as initialWorkData,
  cvData as initialCvData,
  Project,
  ExperienceItem,
} from '@/data/portfolioData';

export type { Project, ExperienceItem };
export type WorkItem = Project;

export interface ProfileLang {
  name: string;
  role: string;
  location: string;
  availability: string;
  headLine: string;
  taglines?: string[];
  about: string;
  secondaryAbout?: string;
  stats?: { value: string; label: string; sub: string }[];
  skills?: string[];
}

export interface ProfileDataType {
  en: ProfileLang;
  kr: ProfileLang;
}

export interface CVDataType {
  pdfUrl?: string;
  summaryEn?: string;
  summaryKr?: string;
  lastUpdated?: string;
  en?: typeof initialCvData.en;
  kr?: typeof initialCvData.kr;
}

const COLLECTION_NAME = 'portfolio';

/**
 * Trigger Next.js On-Demand ISR Revalidation
 */
export const triggerRevalidate = async (path?: string) => {
  try {
    if (typeof window !== 'undefined') {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
    }
  } catch (err) {
    console.warn('On-demand revalidation notice:', err);
  }
};

const isDbReady = () => {
  return !!(db && typeof db === 'object' && ('type' in db || 'app' in db));
};

// Profile API
export const getProfile = async (): Promise<ProfileDataType> => {
  if (!isDbReady()) return initialProfileData as unknown as ProfileDataType;
  try {
    const docRef = doc(db, COLLECTION_NAME, 'profile');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as ProfileDataType;
    }
    return initialProfileData as unknown as ProfileDataType;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return initialProfileData as unknown as ProfileDataType;
  }
};

export const updateProfile = async (data: ProfileDataType): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, 'profile');
  await setDoc(docRef, data);
  await triggerRevalidate('/');
};

// Experience API
export const getExperiences = async (): Promise<ExperienceItem[]> => {
  if (!isDbReady()) return initialExperienceData;
  try {
    const docRef = doc(db, COLLECTION_NAME, 'experiences');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().list) {
      return docSnap.data().list as ExperienceItem[];
    }
    return initialExperienceData;
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return initialExperienceData;
  }
};

export const updateExperiences = async (list: ExperienceItem[]): Promise<void> => {
  if (!isDbReady()) throw new Error('Database is not initialized. Check Firebase environment variables.');
  const docRef = doc(db, COLLECTION_NAME, 'experiences');
  await setDoc(docRef, { list });
  await triggerRevalidate('/experience');
  await triggerRevalidate('/');
  await triggerRevalidate('/cv');
};

// Works API
export const getWorks = async (): Promise<Project[]> => {
  if (!isDbReady()) return initialWorkData;
  try {
    const docRef = doc(db, COLLECTION_NAME, 'works');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().list) {
      return docSnap.data().list as Project[];
    }
    return initialWorkData;
  } catch (error) {
    console.error('Error fetching works:', error);
    return initialWorkData;
  }
};

export const updateWorks = async (list: Project[]): Promise<void> => {
  if (!isDbReady()) throw new Error('Database is not initialized. Check Firebase environment variables.');
  const docRef = doc(db, COLLECTION_NAME, 'works');
  await setDoc(docRef, { list });
  await triggerRevalidate('/works');
  await triggerRevalidate('/');
};

// CV Settings API
export const getCVSettings = async (): Promise<CVDataType> => {
  if (!isDbReady()) {
    return {
      pdfUrl: '',
      summaryEn: initialCvData.en.summary,
      summaryKr: initialCvData.kr.summary,
      lastUpdated: new Date().toLocaleDateString(),
      en: initialCvData.en,
      kr: initialCvData.kr,
    };
  }
  try {
    const docRef = doc(db, COLLECTION_NAME, 'cv');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as CVDataType;
    }
    return {
      pdfUrl: '',
      summaryEn: initialCvData.en.summary,
      summaryKr: initialCvData.kr.summary,
      lastUpdated: new Date().toLocaleDateString(),
      en: initialCvData.en,
      kr: initialCvData.kr,
    };
  } catch (error) {
    console.error('Error fetching cv settings:', error);
    return {
      pdfUrl: '',
      summaryEn: initialCvData.en.summary,
      summaryKr: initialCvData.kr.summary,
      lastUpdated: new Date().toLocaleDateString(),
      en: initialCvData.en,
      kr: initialCvData.kr,
    };
  }
};

export const updateCVSettings = async (data: CVDataType): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, 'cv');
  await setDoc(docRef, data);
  await triggerRevalidate('/cv');
};

// Seed initial data from portfolioData.ts to Firestore
export const seedInitialData = async (): Promise<void> => {
  const profileRef = doc(db, COLLECTION_NAME, 'profile');
  const expRef = doc(db, COLLECTION_NAME, 'experiences');
  const worksRef = doc(db, COLLECTION_NAME, 'works');
  const cvRef = doc(db, COLLECTION_NAME, 'cv');

  await setDoc(profileRef, initialProfileData);
  await setDoc(expRef, { list: initialExperienceData });
  await setDoc(worksRef, { list: initialWorkData });
  await setDoc(cvRef, {
    pdfUrl: '',
    summaryEn: initialCvData.en.summary,
    summaryKr: initialCvData.kr.summary,
    lastUpdated: new Date().toLocaleDateString(),
    en: initialCvData.en,
    kr: initialCvData.kr,
  });
  await triggerRevalidate();
};

// Realtime listeners
export const subscribeToProfile = (callback: (data: ProfileDataType) => void) => {
  const docRef = doc(db, COLLECTION_NAME, 'profile');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as ProfileDataType);
      } else {
        callback(initialProfileData as unknown as ProfileDataType);
      }
    },
    (err) => {
      console.warn('Profile listener fallback:', err);
      callback(initialProfileData as unknown as ProfileDataType);
    }
  );
};

export const subscribeToExperiences = (callback: (data: ExperienceItem[]) => void) => {
  const docRef = doc(db, COLLECTION_NAME, 'experiences');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists() && docSnap.data().list) {
        callback(docSnap.data().list as ExperienceItem[]);
      } else {
        callback(initialExperienceData);
      }
    },
    (err) => {
      console.warn('Experiences listener fallback:', err);
      callback(initialExperienceData);
    }
  );
};

export const subscribeToWorks = (callback: (data: Project[]) => void) => {
  const docRef = doc(db, COLLECTION_NAME, 'works');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists() && docSnap.data().list) {
        callback(docSnap.data().list as Project[]);
      } else {
        callback(initialWorkData);
      }
    },
    (err) => {
      console.warn('Works listener fallback:', err);
      callback(initialWorkData);
    }
  );
};

export const subscribeToCVSettings = (callback: (data: CVDataType) => void) => {
  const docRef = doc(db, COLLECTION_NAME, 'cv');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as CVDataType);
      } else {
        callback({
          pdfUrl: '',
          summaryEn: initialCvData.en.summary,
          summaryKr: initialCvData.kr.summary,
          lastUpdated: new Date().toLocaleDateString(),
          en: initialCvData.en,
          kr: initialCvData.kr,
        });
      }
    },
    (err) => {
      console.warn('CV listener fallback:', err);
      callback({
        pdfUrl: '',
        summaryEn: initialCvData.en.summary,
        summaryKr: initialCvData.kr.summary,
        lastUpdated: new Date().toLocaleDateString(),
        en: initialCvData.en,
        kr: initialCvData.kr,
      });
    }
  );
};
