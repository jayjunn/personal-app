'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkItem, getWorks, updateWorks } from '@/service/portfolioService';
import { workData as defaultWorks } from '@/data/portfolioData';
import styles from '@/app/styles/Admin.module.css';

export default function WorksEditor() {
  const queryClient = useQueryClient();
  const [works, setWorks] = useState<WorkItem[]>(defaultWorks as unknown as WorkItem[]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<WorkItem | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // TanStack Query: fetch works
  const { data: remoteWorks, isLoading } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
    initialData: defaultWorks as unknown as WorkItem[],
  });

  useEffect(() => {
    if (remoteWorks) {
      setWorks(remoteWorks);
    }
  }, [remoteWorks]);

  // TanStack Query: mutation to save works
  const saveMutation = useMutation({
    mutationFn: (newWorks: WorkItem[]) => updateWorks(newWorks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] });
      setMessage({ text: '프로젝트 목록이 성공적으로 저장되었습니다! ✅', type: 'success' });
      setTimeout(() => setMessage(null), 3500);
    },
    onError: (err: any) => {
      console.error(err);
      setMessage({ text: `저장 실패: ${err.message || '오류 발생'}`, type: 'error' });
    },
  });

  const handleStartAdd = () => {
    setEditItem({
      id: Date.now(),
      name: '',
      category: 'web',
      company: 'Personal Project',
      img: 'https://res.cloudinary.com/dgmnoyv6u/image/upload/v1688622910/Screenshot_2023-07-06_at_2.54.03_PM_a8dssi.png',
      description: {
        en: '',
        kr: '',
      },
      stacks: ['REACT', 'NEXT.JS', 'TYPESCRIPT'],
      link: 'https://',
    });
    setEditingIndex(-1);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditItem(JSON.parse(JSON.stringify(works[index])));
  };

  const handleDelete = (index: number) => {
    if (confirm(`'${works[index].name}' 프로젝트를 정말 삭제하시겠습니까?`)) {
      const updated = works.filter((_, i) => i !== index);
      setWorks(updated);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= works.length) return;
    const updated = [...works];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setWorks(updated);
  };

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!editItem) return;
    const trimmed = tagInput.trim().toUpperCase();
    if (!trimmed) return;

    if (!editItem.stacks.includes(trimmed)) {
      setEditItem({
        ...editItem,
        stacks: [...editItem.stacks, trimmed],
      });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editItem) return;
    setEditItem({
      ...editItem,
      stacks: editItem.stacks.filter((s) => s !== tagToRemove),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editItem) return;

    const file = files[0];
    const uploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

    if (!uploadUrl || !uploadPreset) {
      alert('Cloudinary 환경변수가 설정되어 있지 않습니다. 이미지 URL을 직접 입력해주세요.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Image upload failed');
      const data = await res.json();
      if (data.secure_url) {
        setEditItem({
          ...editItem,
          img: data.secure_url,
        });
      }
    } catch (err: any) {
      console.error(err);
      alert('이미지 업로드 실패: ' + (err.message || '오류 발생'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveModal = () => {
    if (!editItem) return;
    if (!editItem.name.trim()) {
      alert('프로젝트 이름을 입력해주세요.');
      return;
    }

    let updatedList: WorkItem[];
    if (editingIndex === -1) {
      updatedList = [editItem, ...works];
    } else if (editingIndex !== null) {
      updatedList = [...works];
      updatedList[editingIndex] = editItem;
    } else {
      return;
    }

    setWorks(updatedList);
    setEditingIndex(null);
    setEditItem(null);
  };

  const handleSaveAll = () => {
    setMessage(null);
    saveMutation.mutate(works);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div className={styles.editorHeader}>
        <div>
          <h2 className={styles.editorTitle}>프로젝트 (Works) 관리</h2>
          <p className={styles.editorSubtitle}>
            홈 화면 슬라이더 및 `/works`에 표시되는 프로젝트 목록을 추가, 편집합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartAdd}
          className={styles.btnPrimary}>
          + 새 프로젝트 추가
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

      {/* Projects Grid */}
      <div className={styles.grid2}>
        {isLoading ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', backgroundColor: '#fff', border: '2px dashed #000', fontFamily: 'monospace' }}>
            데이터를 불러오는 중입니다...
          </div>
        ) : works.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', backgroundColor: '#fff', border: '2px dashed #000', fontFamily: 'monospace' }}>
            등록된 프로젝트가 없습니다. 상단의 [+ 새 프로젝트 추가] 버튼을 눌러주세요.
          </div>
        ) : (
          works.map((work, idx) => (
            <div key={`admin-work-${work.id ?? 'idx'}-${work.name}-${idx}`} className={styles.itemCard}>
              <div>
                <div className={styles.itemCardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={styles.adminBadge}>#{idx + 1}</span>
                    <h3 className={styles.itemCardTitle}>{work.name}</h3>
                  </div>
                  {work.company && (
                    <span style={{ backgroundColor: '#e7e2d0', padding: '2px 8px', border: '1px solid #000', fontSize: '12px', fontWeight: 700 }}>
                      {work.company}
                    </span>
                  )}
                </div>

                {work.img && (
                  <div style={{ width: '100%', height: '180px', backgroundColor: '#f0f0f0', border: '2px solid #000', margin: '14px 0', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={work.img}
                      alt={work.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://placehold.co/600x400/e7e2d0/0c0c0c?text=' +
                          encodeURIComponent(work.name);
                      }}
                    />
                  </div>
                )}

                <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.5, marginBottom: '12px' }}>
                  {work.description?.kr || work.description?.en || '설명 없음'}
                </p>

                <div className={styles.tagList}>
                  {work.stacks?.map((stack, sIdx) => (
                    <span key={`admin-work-stack-${work.name}-${stack}-${sIdx}`} className={styles.tagChip}>
                      {stack}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '2px solid rgba(0,0,0,0.15)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', border: '2px solid #000' }}>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    style={{ padding: '6px 10px', background: '#e7e2d0', borderRight: '1px solid #000', cursor: 'pointer', fontWeight: 700 }}
                    title="위로 이동">
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={idx === works.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    style={{ padding: '6px 10px', background: '#e7e2d0', cursor: 'pointer', fontWeight: 700 }}
                    title="아래로 이동">
                    ▼
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
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
          총 <strong>{works.length}</strong>개의 프로젝트가 등록되어 있습니다.
        </span>
        <button
          type="button"
          disabled={saveMutation.isPending}
          onClick={handleSaveAll}
          className={styles.btnPrimary}
          style={{ padding: '14px 32px', fontSize: '14px' }}>
          {saveMutation.isPending ? '저장 처리 중...' : '💾 프로젝트 목록 전체 저장'}
        </button>
      </div>

      {/* Edit / Add Modal */}
      {editItem && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingIndex === -1 ? '신규 프로젝트 등록' : `프로젝트 수정: ${editItem.name}`}
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
                  <label className={styles.label}>프로젝트명 (Project Name)</label>
                  <input
                    type="text"
                    value={editItem.name}
                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    placeholder="예: Airbnb Clone / Portfolio 2026"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                  <label className={styles.label}>구분 / 소속 (Company / Tag)</label>
                  <input
                    type="text"
                    value={editItem.company || ''}
                    onChange={(e) => setEditItem({ ...editItem, company: e.target.value })}
                    placeholder="예: Toy Project, Freelance, 회사명"
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Image URL & Upload */}
              <div className={styles.formGroup} style={{ margin: 0 }}>
                <label className={styles.label}>이미지 (Image URL / Upload)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={editItem.img}
                    onChange={(e) => setEditItem({ ...editItem, img: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
                    className={styles.input}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="img-upload-input"
                  />
                  <label
                    htmlFor="img-upload-input"
                    className={styles.btnSecondary}
                    style={{ whiteSpace: 'nowrap' }}>
                    {uploading ? '업로드 중...' : '📁 파일 업로드'}
                  </label>
                </div>
                {editItem.img && (
                  <div style={{ width: '160px', height: '100px', border: '2px solid #000', marginTop: '10px', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editItem.img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {/* Link */}
              <div className={styles.formGroup} style={{ margin: 0 }}>
                <label className={styles.label}>배포 / 깃허브 링크 (Link URL)</label>
                <input
                  type="text"
                  value={editItem.link}
                  onChange={(e) => setEditItem({ ...editItem, link: e.target.value })}
                  placeholder="https://github.com/... or https://..."
                  className={styles.input}
                />
              </div>

              {/* Descriptions */}
              <div className={styles.grid2}>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                  <label className={styles.label}>영문 설명 (EN Description)</label>
                  <textarea
                    rows={3}
                    value={editItem.description?.en || ''}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        description: { ...editItem.description, en: e.target.value },
                      })
                    }
                    placeholder="This project is built with..."
                    className={styles.textarea}
                  />
                </div>
                <div className={styles.formGroup} style={{ margin: 0 }}>
                  <label className={styles.label}>국문 설명 (KR Description)</label>
                  <textarea
                    rows={3}
                    value={editItem.description?.kr || ''}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        description: { ...editItem.description, kr: e.target.value },
                      })
                    }
                    placeholder="이 프로젝트는 사용자 경험 중심의..."
                    className={styles.textarea}
                  />
                </div>
              </div>

              {/* Stacks Tags */}
              <div className={styles.formGroup} style={{ margin: 0 }}>
                <label className={styles.label}>기술 태그 (Stacks)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="태그 입력 후 Enter 또는 추가 클릭 (예: NEXT.JS, TAILWIND)"
                    className={styles.input}
                    style={{ flex: 1, textTransform: 'uppercase' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className={styles.btnPrimary}
                    style={{ whiteSpace: 'nowrap' }}>
                    + 추가
                  </button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    padding: '14px',
                    backgroundColor: '#fff',
                    border: '2px solid #000',
                    marginTop: '8px',
                    minHeight: '48px',
                  }}>
                  {editItem.stacks?.map((stack, sIdx) => (
                    <span key={`admin-edit-stack-${stack}-${sIdx}`} className={styles.tagChip}>
                      <span>{stack}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(stack)}
                        className={styles.tagDeleteBtn}
                        title="제거">
                        &times;
                      </button>
                    </span>
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
