'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileDataType, getProfile, updateProfile } from '@/service/portfolioService';
import { profileData as defaultProfile } from '@/data/portfolioData';
import styles from '@/app/styles/Admin.module.css';

export default function ProfileEditor() {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<ProfileDataType>(defaultProfile as unknown as ProfileDataType);
  const [activeLang, setActiveLang] = useState<'en' | 'kr'>('en');
  const [skillInput, setSkillInput] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // TanStack Query: fetch profile
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

  // TanStack Query: mutation to save profile
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className={styles.editorHeader}>
        <div>
          <h2 className={styles.editorTitle}>프로필 및 스킬 (Profile) 관리</h2>
          <p className={styles.editorSubtitle}>
            홈 화면 상단 소개문구, 헤드라인, About 설명 및 핵심 기술 스택을 편집합니다.
          </p>
        </div>

        {/* Language Tabs */}
        <div style={{ display: 'flex', border: '2px solid #000000' }}>
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            style={{
              padding: '10px 20px',
              fontWeight: 800,
              fontSize: '13px',
              backgroundColor: activeLang === 'en' ? '#000000' : '#e7e2d0',
              color: activeLang === 'en' ? '#e7e2d0' : '#000000',
              cursor: 'pointer',
            }}>
            🇬🇧 English
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('kr')}
            style={{
              padding: '10px 20px',
              fontWeight: 800,
              fontSize: '13px',
              backgroundColor: activeLang === 'kr' ? '#000000' : '#e7e2d0',
              color: activeLang === 'kr' ? '#e7e2d0' : '#000000',
              borderLeft: '2px solid #000000',
              cursor: 'pointer',
            }}>
            🇰🇷 한국어
          </button>
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: '14px 20px',
            border: '2px solid #000000',
            fontWeight: 700,
            fontSize: '13px',
            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: message.type === 'success' ? '#065f46' : '#991b1b',
          }}>
          {message.text}
        </div>
      )}

      {/* Main Edit Card */}
      <div className={styles.itemCard}>
        {isLoading ? (
          <div style={{ padding: '30px', textAlign: 'center', fontFamily: 'monospace' }}>
            데이터를 불러오는 중입니다...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className={styles.formGroup} style={{ margin: 0 }}>
              <label className={styles.label}>
                이름 (Name) - [{activeLang.toUpperCase()}]
              </label>
              <input
                type="text"
                value={current.name || ''}
                onChange={(e) => handleTextChange('name', e.target.value)}
                placeholder="예: YOUNGGEUN JUN / 전영근"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup} style={{ margin: 0 }}>
              <label className={styles.label}>
                헤드라인 문구 (Headline) - [{activeLang.toUpperCase()}]
              </label>
              <input
                type="text"
                value={current.headLine || ''}
                onChange={(e) => handleTextChange('headLine', e.target.value)}
                placeholder="예: I make digital screens do cool stuff."
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup} style={{ margin: 0 }}>
              <label className={styles.label}>
                소개글 (About Text) - [{activeLang.toUpperCase()}]
              </label>
              <textarea
                rows={5}
                value={current.about || ''}
                onChange={(e) => handleTextChange('about', e.target.value)}
                placeholder="개발자 소개 및 지향하는 가치에 대한 상세 설명..."
                className={styles.textarea}
              />
            </div>

            {/* Skills Tag Management */}
            <div className={styles.formGroup} style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className={styles.label}>
                  기술 스택 태그 (Skills) - [{activeLang.toUpperCase()}]
                </label>
                <span style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
                  총 {current.skills?.length || 0}개 등록됨
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="스킬명 입력 후 Enter (예: REACT, NEXT.JS, TAILWINDCSS)"
                  className={styles.input}
                  style={{ flex: 1, textTransform: 'uppercase' }}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className={styles.btnPrimary}
                  style={{ whiteSpace: 'nowrap' }}>
                  + 스킬 추가
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  minHeight: '60px',
                  padding: '16px',
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  marginTop: '10px',
                }}>
                {current.skills && current.skills.length > 0 ? (
                  current.skills.map((skill, sIdx) => (
                    <span key={`admin-skill-${skill}-${sIdx}`} className={styles.tagChip}>
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className={styles.tagDeleteBtn}
                        title="삭제">
                        &times;
                      </button>
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                    등록된 기술 스택이 없습니다.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
        <button
          type="button"
          disabled={saveMutation.isPending}
          onClick={handleSave}
          className={styles.btnPrimary}
          style={{ padding: '14px 36px', fontSize: '15px' }}>
          {saveMutation.isPending ? '저장 처리 중...' : '💾 프로필 설정 저장하기'}
        </button>
      </div>
    </div>
  );
}
