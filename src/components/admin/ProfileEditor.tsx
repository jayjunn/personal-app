'use client';

import React, { useState, useEffect } from 'react';
import { ProfileDataType, getProfile, updateProfile } from '@/service/portfolioService';
import { profileData as defaultProfile } from '@/data/portfolioData';
import styles from '@/app/styles/Admin.module.css';

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

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile(profile);
      setMessage({ text: '프로필 정보가 성공적으로 저장되었습니다! ✅', type: 'success' });
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div className={styles.editorHeader}>
        <div>
          <h2 className={styles.editorTitle}>프로필 (Profile) 편집</h2>
          <p className={styles.editorSubtitle}>
            홈 화면 상단 및 이력서에 표시되는 기본 정보와 기술 스택을 편집합니다.
          </p>
        </div>

        {/* Language Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={activeLang === 'en' ? styles.btnPrimary : styles.btnSecondary}>
            🇬🇧 ENGLISH (EN)
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('kr')}
            className={activeLang === 'kr' ? styles.btnPrimary : styles.btnSecondary}>
            🇰🇷 한국어 (KR)
          </button>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          style={{
            padding: '14px 20px',
            border: '2px solid #000',
            fontWeight: 700,
            fontSize: '13px',
            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: message.type === 'success' ? '#065f46' : '#991b1b',
          }}>
          {message.text}
        </div>
      )}

      {/* Form Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            이름 (Name) <span>[{activeLang.toUpperCase()}]</span>
          </label>
          <input
            type="text"
            value={current.name || ''}
            onChange={(e) => handleTextChange('name', e.target.value)}
            placeholder="YOUNGGEUN JUN / 전영근"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            헤드라인 (HeadLine) <span>[{activeLang.toUpperCase()}]</span>
          </label>
          <input
            type="text"
            value={current.headLine || ''}
            onChange={(e) => handleTextChange('headLine', e.target.value)}
            placeholder="I make digital screens do cool stuff."
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            소개글 (About) <span>[{activeLang.toUpperCase()}]</span>
          </label>
          <textarea
            rows={5}
            value={current.about || ''}
            onChange={(e) => handleTextChange('about', e.target.value)}
            placeholder="I'm a Creative Software Developer..."
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            기술 스택 (Skills) <span>[{activeLang.toUpperCase()}]</span>
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="스킬 입력 후 Enter 또는 추가 버튼 클릭 (예: REACT, NEXT.JS, TYPESCRIPT)"
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
              current.skills.map((skill) => (
                <span key={skill} className={styles.tagChip}>
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

        {/* Save Footer */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '2px solid #000000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <span style={{ fontSize: '12px', color: '#555', fontFamily: 'monospace' }}>
            * 변경 사항은 홈 화면과 CV에 즉시 반영됩니다.
          </span>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className={styles.btnPrimary}
            style={{ padding: '14px 32px', fontSize: '14px' }}>
            {saving ? '저장 처리 중...' : '💾 프로필 전체 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
