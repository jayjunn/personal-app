'use client';

import React, { useState, useEffect } from 'react';
import { ProfileDataType, getProfile, updateProfile } from '@/service/portfolioService';
import { profileData as defaultProfile } from '@/data/portfolioData';

export default function ProfileEditor() {
  const [profile, setProfile] = useState<ProfileDataType>(defaultProfile as unknown as ProfileDataType);
  const [activeLang, setActiveLang] = useState<'en' | 'kr'>('en');
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    getProfile().then((data) => {
      if (data) setProfile(data);
    });
  }, []);

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

    const currentSkills = profile[activeLang].skills || [];
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
        skills: (prev[activeLang].skills || []).filter((s: string) => s !== skillToRemove),
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile(profile);
      setMessage({ text: '프로필이 성공적으로 저장되었습니다! ✅', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setMessage({ text: `저장 실패: ${err.message || '오류 발생'}`, type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3500);
    }
  };

  const current = profile[activeLang] || { name: '', headLine: '', about: '', skills: [] };

  return (
    <div className="brutal-card p-6 md:p-8 bg-[#f2eee0]">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold uppercase">프로필 (Profile) 편집</h2>
          <p className="text-sm text-gray-700 mt-1">
            홈 화면 상단 및 이력서에 표시되는 기본 정보와 기술 스택을 편집합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={`px-4 py-2 text-sm font-bold border-2 border-black ${
              activeLang === 'en' ? 'bg-black text-[#e7e2d0]' : 'bg-transparent text-black hover:bg-black/10'
            }`}>
            ENGLISH (EN)
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('kr')}
            className={`px-4 py-2 text-sm font-bold border-2 border-black ${
              activeLang === 'kr' ? 'bg-black text-[#e7e2d0]' : 'bg-transparent text-black hover:bg-black/10'
            }`}>
            한국어 (KR)
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 border-2 border-black font-bold text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
          }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2">
            이름 (Name) - [{activeLang.toUpperCase()}]
          </label>
          <input
            type="text"
            value={current.name || ''}
            onChange={(e) => handleTextChange('name', e.target.value)}
            placeholder="YOUNGGEUN JUN / 전영근"
            className="w-full p-3 bg-white border-2 border-black font-medium focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2">
            헤드라인 (HeadLine) - [{activeLang.toUpperCase()}]
          </label>
          <input
            type="text"
            value={current.headLine || ''}
            onChange={(e) => handleTextChange('headLine', e.target.value)}
            placeholder="I make digital screens do cool stuff."
            className="w-full p-3 bg-white border-2 border-black font-medium focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2">
            소개글 (About) - [{activeLang.toUpperCase()}]
          </label>
          <textarea
            rows={4}
            value={current.about || ''}
            onChange={(e) => handleTextChange('about', e.target.value)}
            placeholder="I'm a Creative Software Developer..."
            className="w-full p-3 bg-white border-2 border-black font-medium focus:outline-none focus:ring-2 focus:ring-black resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2">
            기술 스택 (Skills) - [{activeLang.toUpperCase()}]
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="스킬 입력 후 Enter 또는 추가 클릭 (예: REACT, NEXT.JS, TYPESCRIPT)"
              className="flex-1 p-3 bg-white border-2 border-black font-medium focus:outline-none focus:ring-2 focus:ring-black uppercase text-sm"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="brutal-btn whitespace-nowrap">
              스킬 추가 +
            </button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-white/70 border-2 border-black">
            {current.skills && current.skills.length > 0 ? (
              current.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-[#e7e2d0] text-xs font-bold border border-black rounded-[6px]">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-400 font-bold ml-1 text-sm leading-none"
                    title="삭제">
                    &times;
                  </button>
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500 italic">등록된 기술 스택이 없습니다.</span>
            )}
          </div>
        </div>

        <div className="pt-4 border-t-2 border-black flex justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="brutal-btn px-8 py-3 text-base">
            {saving ? '저장 중...' : '프로필 전체 저장 💾'}
          </button>
        </div>
      </div>
    </div>
  );
}
