'use client';

import React, { useState, useEffect, useRef } from 'react';
import { WorkItem, getWorks, updateWorks } from '@/service/portfolioService';
import { workData as defaultWorks } from '@/data/portfolioData';

export default function WorksEditor() {
  const [works, setWorks] = useState<WorkItem[]>(defaultWorks as unknown as WorkItem[]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<WorkItem | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getWorks().then((data) => {
      if (data) setWorks(data);
    });
  }, []);

  const handleStartAdd = () => {
    setEditItem({
      id: Date.now(),
      name: '',
      category: 'web',
      company: 'Toy Project',
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

  // Tag management
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

  // Image Upload via Cloudinary
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

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateWorks(works);
      setMessage({ text: '프로젝트 목록이 성공적으로 저장되었습니다! ✅', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setMessage({ text: `저장 실패: ${err.message || '오류 발생'}`, type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3500);
    }
  };

  return (
    <div className="brutal-card p-6 md:p-8 bg-[#f2eee0]">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold uppercase">프로젝트 / 작업물 (Works) 관리</h2>
          <p className="text-sm text-gray-700 mt-1">
            홈 화면 하단 슬라이더 및 CV에 표시되는 프로젝트를 추가, 수정, 삭제합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleStartAdd}
            className="brutal-btn">
            + 새 프로젝트 추가
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

      {/* Projects Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {works.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white/50 border-2 border-dashed border-black">
            등록된 프로젝트가 없습니다. [새 프로젝트 추가] 버튼을 눌러주세요.
          </div>
        ) : (
          works.map((work, idx) => (
            <div
              key={work.id || idx}
              className="bg-white border-2 border-black p-4 flex flex-col justify-between shadow-[3px_3px_0px_#0c0c0c]">
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-black/20 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-black text-[#e7e2d0] px-2 py-0.5 font-bold">
                      #{idx + 1}
                    </span>
                    <h3 className="font-bold text-base">{work.name}</h3>
                  </div>
                  {work.company && (
                    <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 border border-black">
                      {work.company}
                    </span>
                  )}
                </div>

                {work.img && (
                  <div className="relative w-full h-36 bg-gray-100 border border-black mb-3 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={work.img}
                      alt={work.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://placehold.co/600x400/e7e2d0/0c0c0c?text=' + encodeURIComponent(work.name);
                      }}
                    />
                  </div>
                )}

                <p className="text-xs text-gray-700 line-clamp-2 mb-3">
                  {work.description?.kr || work.description?.en || '설명 없음'}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {work.stacks?.map((stack) => (
                    <span key={stack} className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 border border-black">
                      {stack}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-black/20 flex items-center justify-between">
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="px-2 py-1 border border-black text-xs font-bold bg-[#e7e2d0] disabled:opacity-30">
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={idx === works.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="px-2 py-1 border border-black text-xs font-bold bg-[#e7e2d0] disabled:opacity-30">
                    ▼
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(idx)}
                    className="px-3 py-1 border border-black text-xs font-bold bg-yellow-200 hover:bg-yellow-300">
                    수정 ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="px-3 py-1 border border-black text-xs font-bold bg-red-200 hover:bg-red-300">
                    삭제 🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-4 border-t-2 border-black flex justify-between items-center">
        <span className="text-xs text-gray-600 font-medium">총 {works.length}개의 프로젝트가 등록되어 있습니다.</span>
        <button
          type="button"
          disabled={saving}
          onClick={handleSaveAll}
          className="brutal-btn px-8 py-3 text-base">
          {saving ? '저장 중...' : '프로젝트 목록 전체 저장 💾'}
        </button>
      </div>

      {/* Edit / Add Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="brutal-card bg-[#f2eee0] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative my-8">
            <h3 className="text-xl font-bold border-b-2 border-black pb-3 mb-6 uppercase">
              {editingIndex === -1 ? '신규 프로젝트 추가' : `프로젝트 수정: ${editItem.name}`}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">프로젝트명 (Project Name)</label>
                  <input
                    type="text"
                    value={editItem.name}
                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    placeholder="예: Airbnb Clone / Blocko"
                    className="w-full p-2.5 bg-white border-2 border-black text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">구분 / 소속 (Company / Tag)</label>
                  <input
                    type="text"
                    value={editItem.company || ''}
                    onChange={(e) => setEditItem({ ...editItem, company: e.target.value })}
                    placeholder="예: Toy Project, Freelance, 회사명"
                    className="w-full p-2.5 bg-white border-2 border-black text-sm font-medium"
                  />
                </div>
              </div>

              {/* Image URL & Upload */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1">이미지 (Image URL)</label>
                <div className="flex flex-col md:flex-row gap-2">
                  <input
                    type="text"
                    value={editItem.img}
                    onChange={(e) => setEditItem({ ...editItem, img: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
                    className="flex-1 p-2.5 bg-white border-2 border-black text-xs font-mono"
                  />
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      id="img-upload-input"
                    />
                    <label
                      htmlFor="img-upload-input"
                      className="px-4 py-2 border-2 border-black bg-white font-bold text-xs cursor-pointer hover:bg-gray-100 flex items-center justify-center">
                      {uploading ? '업로드 중...' : '📁 파일 업로드'}
                    </label>
                  </div>
                </div>
                {editItem.img && (
                  <div className="mt-2 relative w-32 h-20 bg-gray-100 border border-black overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editItem.img} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Link */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1">배포 / 깃허브 링크 (Link URL)</label>
                <input
                  type="text"
                  value={editItem.link}
                  onChange={(e) => setEditItem({ ...editItem, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-white border-2 border-black text-xs font-mono"
                />
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">영문 설명 (EN Description)</label>
                  <textarea
                    rows={3}
                    value={editItem.description?.en || ''}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        description: { ...editItem.description, en: e.target.value },
                      })
                    }
                    placeholder="This is a project for..."
                    className="w-full p-2.5 bg-white border-2 border-black text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">국문 설명 (KR Description)</label>
                  <textarea
                    rows={3}
                    value={editItem.description?.kr || ''}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        description: { ...editItem.description, kr: e.target.value },
                      })
                    }
                    placeholder="이 프로젝트는..."
                    className="w-full p-2.5 bg-white border-2 border-black text-xs"
                  />
                </div>
              </div>

              {/* Stacks Tags */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1">사용 기술 태그 (Stacks)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="태그 입력 후 Enter 또는 추가 (예: NEXT.JS, PRISMA, TAILWIND)"
                    className="flex-1 p-2 bg-white border-2 border-black text-xs uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1 bg-black text-[#e7e2d0] text-xs font-bold border border-black">
                    + 추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 p-2 bg-white/70 border border-black min-h-[36px]">
                  {editItem.stacks?.map((stack) => (
                    <span
                      key={stack}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-[#e7e2d0] text-[11px] font-bold">
                      {stack}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(stack)}
                        className="hover:text-red-400 font-bold ml-1"
                        title="제거">
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t-2 border-black">
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setEditItem(null);
                }}
                className="px-4 py-2 border-2 border-black font-bold text-sm bg-white hover:bg-gray-100">
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="brutal-btn px-6 py-2 text-sm">
                목록에 반영
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
