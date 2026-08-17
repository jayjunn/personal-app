'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkItem, getWorks, updateWorks } from '@/service/portfolioService';
import { workData as defaultWorks } from '@/data/portfolioData';

export default function WorksEditor() {
  const queryClient = useQueryClient();
  const [works, setWorks] = useState<WorkItem[]>(defaultWorks as unknown as WorkItem[]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<WorkItem | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: remoteWorks, isLoading } = useQuery({
    queryKey: ['works'],
    queryFn: getWorks,
    initialData: defaultWorks as unknown as WorkItem[],
  });


  useEffect(() => {
    if (remoteWorks && remoteWorks.length > 0) {
      setWorks(remoteWorks);
    }
  }, [remoteWorks]);


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
    <div className="flex flex-col gap-6 w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase m-0 tracking-tight">
            프로젝트 (Works) 관리
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-semibold mt-1">
            홈 화면 슬라이더 및 `/works`에 표시되는 프로젝트 목록을 추가, 편집합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartAdd}
          className="px-4 py-2.5 bg-black text-[#e7e2d0] border-2 border-black font-extrabold text-xs uppercase cursor-pointer hover:bg-neutral-800 transition-colors shadow-[2px_2px_0px_#000000] self-start sm:self-auto">
          + 새 프로젝트 추가
        </button>
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isLoading ? (
          <div className="col-span-full p-10 text-center bg-white border-2 border-dashed border-black font-mono text-sm">
            데이터를 불러오는 중입니다...
          </div>
        ) : works.length === 0 ? (
          <div className="col-span-full p-10 text-center bg-white border-2 border-dashed border-black font-mono text-sm">
            등록된 프로젝트가 없습니다. 상단의 [+ 새 프로젝트 추가] 버튼을 눌러주세요.
          </div>
        ) : (
          works.map((work, idx) => (
            <div
              key={`admin-work-${work.id ?? 'idx'}-${work.name}-${idx}`}
              className="border-[2.5px] border-black bg-white p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-[3px_3px_0px_#000000]">
              <div>
                <div className="flex items-center justify-between border-b border-black pb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 bg-black text-[#e7e2d0] font-mono font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-black uppercase m-0">{work.name}</h3>
                  </div>
                  {work.company && (
                    <span className="bg-[#e7e2d0] px-2 py-0.5 border border-black text-xs font-bold font-mono">
                      {work.company}
                    </span>
                  )}
                </div>

                {work.img && (
                  <div className="w-full h-44 bg-neutral-100 border-2 border-black my-3 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={work.img}
                      alt={work.name}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://placehold.co/600x400/e7e2d0/0c0c0c?text=' +
                          encodeURIComponent(work.name);
                      }}
                    />
                  </div>
                )}

                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed mb-3">
                  {work.description?.kr || work.description?.en || '설명 없음'}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {work.stacks?.map((stack, sIdx) => (
                    <span
                      key={`admin-work-stack-${work.name}-${stack}-${sIdx}`}
                      className="text-[11px] font-bold border border-black px-2 py-0.5 bg-[#f5f0df]">
                      {stack}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-black/20 pt-3 flex justify-between items-center flex-wrap gap-2">
                <div className="flex border-2 border-black">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="px-2.5 py-1 bg-[#e7e2d0] border-r border-black cursor-pointer font-bold text-xs hover:bg-black hover:text-[#e7e2d0] disabled:opacity-40"
                    title="위로 이동">
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={idx === works.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="px-2.5 py-1 bg-[#e7e2d0] cursor-pointer font-bold text-xs hover:bg-black hover:text-[#e7e2d0] disabled:opacity-40"
                    title="아래로 이동">
                    ▼
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(idx)}
                    className="px-3 py-1 bg-amber-400 border-2 border-black text-black font-extrabold text-xs uppercase cursor-pointer hover:bg-amber-300 transition-colors shadow-[1px_1px_0px_#000000]">
                    수정 ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="px-3 py-1 bg-rose-500 text-white border-2 border-black font-extrabold text-xs uppercase cursor-pointer hover:bg-rose-600 transition-colors shadow-[1px_1px_0px_#000000]">
                    삭제 🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="pt-5 border-t-2 border-black flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-xs sm:text-sm text-neutral-600 font-mono">
          총 <strong>{works.length}</strong>개의 프로젝트가 등록되어 있습니다.
        </span>
        <button
          type="button"
          disabled={saveMutation.isPending}
          onClick={handleSaveAll}
          className="w-full sm:w-auto px-8 py-3.5 bg-black text-[#e7e2d0] border-2 border-black font-black text-sm uppercase cursor-pointer hover:bg-neutral-800 transition-colors shadow-[3px_3px_0px_#000000] disabled:opacity-50">
          {saveMutation.isPending ? '저장 처리 중...' : '💾 프로젝트 목록 전체 저장'}
        </button>
      </div>

      {/* Edit / Add Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#e7e2d0] border-4 border-black p-5 sm:p-7 w-full max-w-[650px] max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_#000000] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b-[3px] border-black pb-3">
              <h3 className="text-lg sm:text-xl font-black uppercase m-0">
                {editingIndex === -1 ? '신규 프로젝트 등록' : `프로젝트 수정: ${editItem.name}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setEditItem(null);
                }}
                className="text-xl font-black cursor-pointer hover:rotate-90 transition-transform">
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black uppercase">프로젝트명 (Project Name)</label>
                  <input
                    type="text"
                    value={editItem.name}
                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    placeholder="예: Airbnb Clone / Portfolio 2026"
                    className="w-full p-2.5 bg-white border-2 border-black text-sm font-semibold outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black uppercase">구분 / 소속 (Company / Tag)</label>
                  <input
                    type="text"
                    value={editItem.company || ''}
                    onChange={(e) => setEditItem({ ...editItem, company: e.target.value })}
                    placeholder="예: Toy Project, Freelance, 회사명"
                    className="w-full p-2.5 bg-white border-2 border-black text-sm font-semibold outline-none"
                  />
                </div>
              </div>

              {/* Image URL & Upload */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black uppercase">이미지 (Image URL / Upload)</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editItem.img}
                    onChange={(e) => setEditItem({ ...editItem, img: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
                    className="flex-1 p-2.5 bg-white border-2 border-black text-sm font-semibold outline-none"
                  />
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
                    className="px-4 py-2.5 bg-white border-2 border-black text-black font-extrabold text-xs uppercase cursor-pointer hover:bg-black hover:text-[#e7e2d0] transition-colors whitespace-nowrap text-center shadow-[2px_2px_0px_#000000]">
                    {uploading ? '업로드 중...' : '📁 파일 업로드'}
                  </label>
                </div>
                {editItem.img && (
                  <div className="w-36 h-24 border-2 border-black mt-2 bg-white overflow-hidden p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editItem.img} alt="preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              {/* Link */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black uppercase">배포 / 깃허브 링크 (Link URL)</label>
                <input
                  type="text"
                  value={editItem.link}
                  onChange={(e) => setEditItem({ ...editItem, link: e.target.value })}
                  placeholder="https://github.com/... or https://..."
                  className="w-full p-2.5 bg-white border-2 border-black text-sm font-semibold outline-none"
                />
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black uppercase">영문 설명 (EN Description)</label>
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
                    className="w-full p-2.5 bg-white border-2 border-black text-sm font-semibold outline-none resize-y"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black uppercase">국문 설명 (KR Description)</label>
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
                    className="w-full p-2.5 bg-white border-2 border-black text-sm font-semibold outline-none resize-y"
                  />
                </div>
              </div>

              {/* Stacks Tags */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black uppercase">기술 태그 (Stacks)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="태그 입력 후 Enter (예: NEXT.JS, TAILWIND)"
                    className="flex-1 p-2.5 bg-white border-2 border-black text-sm font-semibold uppercase outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2.5 bg-black text-[#e7e2d0] border-2 border-black font-extrabold text-xs uppercase cursor-pointer hover:bg-neutral-800 transition-colors whitespace-nowrap shadow-[2px_2px_0px_#000000]">
                    + 추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-white border-2 border-black mt-2 min-h-[48px]">
                  {editItem.stacks?.map((stack, sIdx) => (
                    <span
                      key={`admin-edit-stack-${stack}-${sIdx}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#e7e2d0] border border-black text-xs font-black uppercase">
                      <span>{stack}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(stack)}
                        className="text-neutral-500 hover:text-red-600 font-black cursor-pointer leading-none"
                        title="제거">
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 mt-3 border-t-2 border-black pt-3">
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setEditItem(null);
                }}
                className="px-4 py-2 bg-white text-black border-2 border-black font-extrabold text-xs uppercase cursor-pointer hover:bg-neutral-200 transition-colors">
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="px-5 py-2 bg-black text-[#e7e2d0] border-2 border-black font-extrabold text-xs uppercase cursor-pointer hover:bg-neutral-800 transition-colors shadow-[2px_2px_0px_#000000]">
                목록에 반영 ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
