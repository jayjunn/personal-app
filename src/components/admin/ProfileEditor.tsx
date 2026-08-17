'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileDataType, getProfile, updateProfile } from '@/service/portfolioService';
import { profileData as defaultProfile } from '@/data/portfolioData';

export default function ProfileEditor() {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<ProfileDataType>(defaultProfile as unknown as ProfileDataType);
  const [activeLang, setActiveLang] = useState<'en' | 'kr'>('en');
  const [skillInput, setSkillInput] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const { data: remoteProfile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    initialData: defaultProfile as unknown as ProfileDataType,
  });


  useEffect(() => {
    if (remoteProfile) {
      setProfile(remoteProfile);
    }
  }, [remoteProfile]);


  const saveMutation = useMutation({
    mutationFn: (newProfile: ProfileDataType) => updateProfile(newProfile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setMessage({ text: '프로필 정보가 성공적으로 저장되었습니다! ✅', type: 'success' });
      setTimeout(() => setMessage(null), 3500);
    },
    onError: (err: any) => {
      console.error(err);
      setMessage({ text: `저장 실패: ${err.message || '오류 발생'}`, type: 'error' });
    },
  });

  const handleTextChange = (field: 'name' | 'headLine' | 'about', value: string) => {
    setProfile((prev) => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [field]: value,
      },
    }));
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = skillInput.trim().toUpperCase();
    if (!trimmed) return;

    const currentSkills = profile[activeLang]?.skills || [];
    if (!currentSkills.includes(trimmed)) {
      setProfile((prev) => ({
        ...prev,
        [activeLang]: {
          ...prev[activeLang],
          skills: [...currentSkills, trimmed],
        },
      }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        skills: (prev[activeLang]?.skills || []).filter((s: string) => s !== skillToRemove),
      },
    }));
  };

  const handleSave = () => {
    setMessage(null);
    saveMutation.mutate(profile);
  };

  const current = profile[activeLang] || {
    name: '',
    headLine: '',
    about: '',
    skills: [],
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase m-0 tracking-tight">
            프로필 및 스킬 (Profile) 관리
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-semibold mt-1">
            홈 화면 상단 소개문구, 헤드라인, About 설명 및 핵심 기술 스택을 편집합니다.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex border-2 border-black self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={`px-4 py-2 font-extrabold text-xs sm:text-sm cursor-pointer transition-colors ${
              activeLang === 'en'
                ? 'bg-black text-[#e7e2d0]'
                : 'bg-[#e7e2d0] text-black hover:bg-neutral-200'
            }`}>
            🇬🇧 English
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('kr')}
            className={`px-4 py-2 font-extrabold text-xs sm:text-sm border-l-2 border-black cursor-pointer transition-colors ${
              activeLang === 'kr'
                ? 'bg-black text-[#e7e2d0]'
                : 'bg-[#e7e2d0] text-black hover:bg-neutral-200'
            }`}>
            🇰🇷 한국어
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 sm:p-4 border-2 border-black font-bold text-xs sm:text-sm ${
            message.type === 'success'
              ? 'bg-emerald-100 text-emerald-900'
              : 'bg-rose-100 text-rose-900'
          }`}>
          {message.text}
        </div>
      )}

      {/* Main Edit Card */}
      <div className="border-[3px] border-black bg-white p-4 sm:p-6 shadow-[4px_4px_0px_#000000]">
        {isLoading ? (
          <div className="p-8 text-center font-mono text-sm">
            데이터를 불러오는 중입니다...
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-neutral-800">
                이름 (Name) - [{activeLang.toUpperCase()}]
              </label>
              <input
                type="text"
                value={current.name || ''}
                onChange={(e) => handleTextChange('name', e.target.value)}
                placeholder="예: YOUNGGEUN JUN / 전영근"
                className="w-full p-3 bg-[#fbf9f4] border-2 border-black text-sm font-semibold outline-none focus:bg-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-neutral-800">
                헤드라인 문구 (Headline) - [{activeLang.toUpperCase()}]
              </label>
              <input
                type="text"
                value={current.headLine || ''}
                onChange={(e) => handleTextChange('headLine', e.target.value)}
                placeholder="예: I make digital screens do cool stuff."
                className="w-full p-3 bg-[#fbf9f4] border-2 border-black text-sm font-semibold outline-none focus:bg-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-neutral-800">
                소개글 (About Text) - [{activeLang.toUpperCase()}]
              </label>
              <textarea
                rows={5}
                value={current.about || ''}
                onChange={(e) => handleTextChange('about', e.target.value)}
                placeholder="개발자 소개 및 지향하는 가치에 대한 상세 설명..."
                className="w-full p-3 bg-[#fbf9f4] border-2 border-black text-sm font-semibold outline-none focus:bg-white resize-y"
              />
            </div>

            {/* Skills Tag Management */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-neutral-800">
                  기술 스택 태그 (Skills) - [{activeLang.toUpperCase()}]
                </label>
                <span className="text-xs text-neutral-500 font-mono">
                  총 {current.skills?.length || 0}개 등록됨
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-1">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="스킬명 입력 후 Enter (예: REACT, NEXT.JS, TAILWINDCSS)"
                  className="flex-1 p-3 bg-[#fbf9f4] border-2 border-black text-sm font-semibold uppercase outline-none focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-3 bg-black text-[#e7e2d0] border-2 border-black font-extrabold text-xs uppercase cursor-pointer hover:bg-neutral-800 transition-colors whitespace-nowrap shadow-[2px_2px_0px_#000000]">
                  + 스킬 추가
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-[#fdfcfa] border-2 border-black mt-2.5">
                {current.skills && current.skills.length > 0 ? (
                  current.skills.map((skill, sIdx) => (
                    <span
                      key={`admin-skill-${skill}-${sIdx}`}
                      className="inline-flex items-center gap-2 px-2.5 py-1 bg-white border border-black text-xs font-black uppercase shadow-[1px_1px_0px_#000000]">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-neutral-400 hover:text-red-600 font-black cursor-pointer text-sm leading-none"
                        title="삭제">
                        &times;
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-neutral-400 italic">
                    등록된 기술 스택이 없습니다.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          disabled={saveMutation.isPending}
          onClick={handleSave}
          className="w-full sm:w-auto px-8 py-3.5 bg-black text-[#e7e2d0] border-2 border-black font-black text-sm uppercase cursor-pointer hover:bg-neutral-800 transition-colors shadow-[3px_3px_0px_#000000] disabled:opacity-50">
          {saveMutation.isPending ? '저장 처리 중...' : '💾 프로필 설정 저장하기'}
        </button>
      </div>
    </div>
  );
}
