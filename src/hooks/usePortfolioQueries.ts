import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProfile,
  updateProfile,
  getWorks,
  updateWorks,
  getExperiences,
  updateExperiences,
  getCVSettings,
  updateCVSettings,
  seedInitialData,
  ProfileDataType,
  WorkItem,
  ExperienceItem,
  CVDataType,
} from '@/service/portfolioService';
import { sendContactEmail, EmailData } from '@/service/contactService';
import { fetchGeminiResponse, GeminiRequest } from '@/service/geminiService';
import { uploadToCloudinary } from '@/service/uploadService';
import {
  profileData as defaultProfile,
  workData as defaultWorks,
  experienceData as defaultExperiences,
  cvData as defaultCv,
} from '@/data/portfolioData';

// Query Keys
export const queryKeys = {
  profile: ['profile'] as const,
  works: ['works'] as const,
  experiences: ['experiences'] as const,
  cvSettings: ['cvSettings'] as const,
};

// Profile Hooks
export function useProfileQuery() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: getProfile,
    initialData: defaultProfile as unknown as ProfileDataType,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile: ProfileDataType) => updateProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

// Works Hooks
export function useWorksQuery() {
  return useQuery({
    queryKey: queryKeys.works,
    queryFn: getWorks,
    initialData: defaultWorks as unknown as WorkItem[],
  });
}

export function useUpdateWorksMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (works: WorkItem[]) => updateWorks(works),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.works });
    },
  });
}

// Experiences Hooks
export function useExperiencesQuery() {
  return useQuery({
    queryKey: queryKeys.experiences,
    queryFn: getExperiences,
    initialData: defaultExperiences,
  });
}

export function useUpdateExperiencesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (experiences: ExperienceItem[]) => updateExperiences(experiences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experiences });
    },
  });
}

// CV Settings Hooks
export function useCvSettingsQuery() {
  return useQuery({
    queryKey: queryKeys.cvSettings,
    queryFn: getCVSettings,
    initialData: {
      pdfUrl: '',
      summaryEn: defaultCv.en.summary,
      summaryKr: defaultCv.kr.summary,
      lastUpdated: '',
      en: defaultCv.en,
      kr: defaultCv.kr,
    },
  });
}

export function useUpdateCvSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cv: CVDataType) => updateCVSettings(cv),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cvSettings });
    },
  });
}

// Contact Email Mutation
export function useContactEmailMutation() {
  return useMutation({
    mutationFn: (emailData: EmailData) => sendContactEmail(emailData),
  });
}

// Gemini AI Chat Mutation
export function useGeminiChatMutation() {
  return useMutation({
    mutationFn: (request: GeminiRequest) => fetchGeminiResponse(request),
  });
}

// Seed Initial Data Mutation
export function useSeedDataMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => seedInitialData(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      queryClient.invalidateQueries({ queryKey: queryKeys.works });
      queryClient.invalidateQueries({ queryKey: queryKeys.experiences });
      queryClient.invalidateQueries({ queryKey: queryKeys.cvSettings });
    },
  });
}

// Cloudinary File Upload Mutation
export function useCloudinaryUploadMutation() {
  return useMutation({
    mutationFn: (file: File) => uploadToCloudinary(file),
  });
}
