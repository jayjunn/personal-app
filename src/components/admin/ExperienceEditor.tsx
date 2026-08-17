'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExperienceItem, getExperiences, updateExperiences } from '@/service/portfolioService';
import { experienceData as defaultExperiences } from '@/data/portfolioData';
import styles from '@/app/styles/Admin.module.css';

export default function ExperienceEditor() {
  const queryClient = useQueryClient();
  const [experiences, setExperiences] = useState<ExperienceItem[]>(defaultExperiences as unknown as ExperienceItem[]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<ExperienceItem | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // TanStack Query: fetch experiences
  const { data: remoteExperiences, isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: getExperiences,
    initialData: defaultExperiences as unknown as ExperienceItem[],
  });

  useEffect(() => {
    if (remoteExperiences) {
      setExperiences(remoteExperiences);
    }
  }, [remoteExperiences]);

  // TanStack Query: mutation to save experiences
  const saveMutation = useMutation({
    mutationFn: (newExps: ExperienceItem[]) => updateExperiences(newExps),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      setMessage({ text: '경력 사항이 성공적으로 저장되었습니다! ✅', type: 'success' });
      setTimeout(() => setMessage(null), 3500);
    },
    onError: (err: any) => {
      console.error(err);
      setMessage({ text: `저장 실패: ${err.message || '오류 발생'}`, type: 'error' });
    },
  });

  const handleStartAdd = () => {
    setEditItem({
      id: Date.now().toString(),
      role: '',
      company: '',
      period: '',
      location: '',
      highlights: [],
      stacks: [],
      description: {
        en: [''],
        kr: [''],
      },
    });
    setEditingIndex(-1);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditItem(JSON.parse(JSON.stringify(experiences[index])));
  };

  const handleDelete = (index: number) => {
    if (confirm(`'${experiences[index].company}' 경력 항목을 정말 삭제하시겠습니까?`)) {
      const updated = experiences.filter((_, i) => i !== index);
      setExperiences(updated);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;
    const updated = [...experiences];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setExperiences(updated);
  };

  const handleBulletChange = (lang: 'en' | 'kr', bIndex: number, val: string) => {
    if (!editItem) return;
    const updatedBullets = [...(editItem.description[lang] || [])];
    updatedBullets[bIndex] = val;
    setEditItem({
      ...editItem,
      description: {
        ...editItem.description,
        [lang]: updatedBullets,
      },
    });
  };

  const handleAddBullet = (lang: 'en' | 'kr') => {
    if (!editItem) return;
    setEditItem({
      ...editItem,
      description: {
        ...editItem.description,
        [lang]: [...(editItem.description[lang] || []), ''],
      },
    });
  };

  const handleRemoveBullet = (lang: 'en' | 'kr', bIndex: number) => {
    if (!editItem) return;
    const updatedBullets = editItem.description[lang].filter((_, i) => i !== bIndex);
    setEditItem({
      ...editItem,
      description: {
        ...editItem.description,
        [lang]: updatedBullets.length > 0 ? updatedBullets : [''],
      },
    });
  };

  const handleSaveModal = () => {
    if (!editItem) return;
    if (!editItem.company.trim() || !editItem.role.trim()) {
      alert('회사명과 직책/역할을 입력해주세요.');
      return;
    }

    let updatedList: ExperienceItem[];
    if (editingIndex === -1) {
      updatedList = [editItem, ...experiences];
    } else if (editingIndex !== null) {
      updatedList = [...experiences];
      updatedList[editingIndex] = editItem;
    } else {
      return;
    }

    setExperiences(updatedList);
    setEditingIndex(null);
    setEditItem(null);
  };

  const handleSaveAll = () => {
    setMessage(null);
    saveMutation.mutate(experiences);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className={styles.editorHeader}>
        <div>
          <h2 className={styles.editorTitle}>경력 사항 (Experience) 관리</h2>
          <p className={styles.editorSubtitle}>
            회사별 직책, 근무 기간, 주요 업무 불릿(영문/국문) 및 기술 스택을 편집합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartAdd}
          className={styles.btnPrimary}>
          + 새 경력 추가하기
        </button>
      </div>

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

      {/* Experience List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff', border: '2px dashed #000', fontFamily: 'monospace' }}>
            데이터를 불러오는 중입니다...
          </div>
        ) : experiences.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff', border: '2px dashed #000', fontFamily: 'monospace' }}>
            등록된 경력 데이터가 없습니다. 상단의 [+ 새 경력 추가하기] 버튼을 눌러주세요.
          </div>
        ) : (
          experiences.map((exp, idx) => (
            <div key={`admin-exp-${exp.id || exp.company}-${idx}`} className={styles.itemCard}>
              <div className={styles.itemCardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span className={styles.adminBadge}>#{idx + 1}</span>
                  <h3 className={styles.itemCardTitle}>
                    {exp.role} <span style={{ color: '#888', fontWeight: 'normal' }}>@</span>{' '}
                    <span style={{ backgroundColor: '#e7e2d0', padding: '2px 8px', border: '1px solid #000', fontSize: '13px' }}>
                      {exp.company}
                    </span>
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', border: '2px solid #000' }}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      style={{ padding: '6px 10px', background: '#e7e2d0', borderRight: '1px solid #000', cursor: 'pointer', fontWeight: 700 }}
                      title="위로">
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === experiences.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      style={{ padding: '6px 10px', background: '#e7e2d0', cursor: 'pointer', fontWeight: 700 }}
                      title="아래로">
                      ▼
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(idx)}
                    className={styles.btnWarning}>
                    수정 ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className={styles.btnDanger}
                    style={{ padding: '8px 14px' }}>
                    삭제 🗑️
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#555', fontFamily: 'monospace', fontWeight: 600 }}>
                📅 {exp.period || '기간 미지정'} | 📍 {exp.location || '위치 미지정'}
              </div>

              {/* Description Bullets preview */}
              <div style={{ marginTop: '8px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#333', marginBottom: '4px' }}>
                  🇰🇷 국문 설명 요약 ({exp.description?.kr?.length || 0}개 항목):
                </p>
                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: '#444', lineHeight: 1.5 }}>
                  {exp.description?.kr?.slice(0, 3).map((bullet, bIdx) => (
                    <li key={`preview-kr-${bIdx}`}>{bullet}</li>
                  ))}
                  {(exp.description?.kr?.length || 0) > 3 && (
                    <li style={{ color: '#888', fontStyle: 'italic' }}>
                      외 {exp.description.kr.length - 3}개 항목 더 있음...
                    </li>
                  )}
                </ul>
              </div>

              {/* Stacks tags preview */}
              {exp.stacks && exp.stacks.length > 0 && (
                <div className={styles.tagList} style={{ marginTop: '4px' }}>
                  {exp.stacks.map((stk, sIdx) => (
                    <span key={`preview-stack-${stk}-${sIdx}`} className={styles.tagChip}>
                      {stk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          paddingTop: '24px',
          borderTop: '2px solid #000000',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <span style={{ fontSize: '13px', color: '#555', fontFamily: 'monospace' }}>
          총 <strong>{experiences.length}</strong>개의 경력 항목이 등록되어 있습니다.
        </span>
        <button
          type="button"
          disabled={saveMutation.isPending}
          onClick={handleSaveAll}
          className={styles.btnPrimary}
          style={{ padding: '14px 32px', fontSize: '14px' }}>
          {saveMutation.isPending ? '저장 처리 중...' : '💾 경력 사항 전체 저장'}
        </button>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox} style={{ maxWidth: '780px' }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingIndex === -1 ? '새 경력 항목 추가' : `경력 수정: ${editItem.company}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setEditItem(null);
                }}
                className={styles.modalCloseBtn}>
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className={styles.grid2}>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                  <label className={styles.label}>회사명 (Company)</label>
                  <input
                    type="text"
                    value={editItem.company}
                    onChange={(e) => setEditItem({ ...editItem, company: e.target.value })}
                    placeholder="예: eBay, COS, Blocko"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                  <label className={styles.label}>직책 / 역할 (Role / Position)</label>
                  <input
                    type="text"
                    value={editItem.role}
                    onChange={(e) => setEditItem({ ...editItem, role: e.target.value })}
                    placeholder="예: Front-End Developer / Software Engineer"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                  <label className={styles.label}>근무 기간 (Period)</label>
                  <input
                    type="text"
                    value={editItem.period}
                    onChange={(e) => setEditItem({ ...editItem, period: e.target.value })}
                    placeholder="예: 2023 - Present / 2021 - 2022"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                  <label className={styles.label}>근무지 (Location)</label>
                  <input
                    type="text"
                    value={editItem.location}
                    onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                    placeholder="예: Seoul / Tokyo"
                    className={styles.input}
                  />
                </div>
              </div>

              {/* English Bullets */}
              <div style={{ backgroundColor: '#ffffff', border: '2px solid #000', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                  <label className={styles.label}>🇬🇧 영문 업무 및 성과 설명 (Bullet Points)</label>
                  <button
                    type="button"
                    onClick={() => handleAddBullet('en')}
                    className={styles.btnPrimary}
                    style={{ padding: '6px 14px', fontSize: '11px' }}>
                    + 항목 추가
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {editItem.description.en.map((bullet, bIdx) => (
                    <div key={`admin-bullet-en-${bIdx}`} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 700, paddingTop: '10px', fontSize: '13px' }}>{bIdx + 1}.</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleBulletChange('en', bIdx, e.target.value)}
                        placeholder="Implemented responsive web features..."
                        className={styles.textarea}
                        style={{ flex: 1, padding: '10px' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet('en', bIdx)}
                        style={{ padding: '8px', color: '#ff4949', cursor: 'pointer', fontWeight: 800 }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Korean Bullets */}
              <div style={{ backgroundColor: '#ffffff', border: '2px solid #000', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                  <label className={styles.label}>🇰🇷 국문 업무 및 성과 설명 (Bullet Points)</label>
                  <button
                    type="button"
                    onClick={() => handleAddBullet('kr')}
                    className={styles.btnPrimary}
                    style={{ padding: '6px 14px', fontSize: '11px' }}>
                    + 항목 추가
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {editItem.description.kr.map((bullet, bIdx) => (
                    <div key={`admin-bullet-kr-${bIdx}`} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 700, paddingTop: '10px', fontSize: '13px' }}>{bIdx + 1}.</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleBulletChange('kr', bIdx, e.target.value)}
                        placeholder="성능 최적화 및 신규 화면 개발 진행..."
                        className={styles.textarea}
                        style={{ flex: 1, padding: '10px' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet('kr', bIdx)}
                        style={{ padding: '8px', color: '#ff4949', cursor: 'pointer', fontWeight: 800 }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '2px solid #000', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setEditItem(null);
                }}
                className={styles.btnSecondary}>
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className={styles.btnPrimary}>
                목록에 반영 ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
