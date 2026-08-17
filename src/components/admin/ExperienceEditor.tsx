'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExperienceItem, getExperiences, updateExperiences } from '@/service/portfolioService';
import { experienceData as defaultExperiences } from '@/data/portfolioData';

export default function ExperienceEditor() {
  const queryClient = useQueryClient();
  const [experiences, setExperiences] = useState<ExperienceItem[]>(defaultExperiences as unknown as ExperienceItem[]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<ExperienceItem | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase m-0 tracking-tight">
            경력 사항 (Experience) 관리
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-semibold mt-1">
            회사별 직책, 근무 기간, 주요 업무 불릿(영문/국문) 및 기술 스택을 편집합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartAdd}
          className="px-4 py-2.5 bg-black text-[#e7e2d0] border-2 border-black font-extrabold text-xs uppercase cursor-pointer hover:bg-neutral-800 transition-colors shadow-[2px_2px_0px_#000000] self-start sm:self-auto">
          + 새 경력 추가하기
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

      {/* Experience List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="p-10 text-center bg-white border-2 border-dashed border-black font-mono text-sm">
            데이터를 불러오는 중입니다...
          </div>
        ) : experiences.length === 0 ? (
          <div className="p-10 text-center bg-white border-2 border-dashed border-black font-mono text-sm">
            등록된 경력 데이터가 없습니다. 상단의 [+ 새 경력 추가하기] 버튼을 눌러주세요.
          </div>
        ) : (
          experiences.map((exp, idx) => (
            <div
              key={`admin-exp-${exp.id || exp.company}-${idx}`}
              className="border-[2.5px] border-black bg-white p-4 sm:p-5 flex flex-col gap-3 shadow-[3px_3px_0px_#000000]">
              <div className="flex items-center justify-between border-b border-black pb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2 py-0.5 bg-black text-[#e7e2d0] font-mono font-bold text-xs">
                    #{idx + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-black uppercase m-0">
                    {exp.role} <span className="text-neutral-400 font-normal">@</span>{' '}
                    <span className="bg-[#e7e2d0] px-2 py-0.5 border border-black text-xs font-bold font-mono">
                      {exp.company}
                    </span>
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex border-2 border-black">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="px-2.5 py-1 bg-[#e7e2d0] border-r border-black cursor-pointer font-bold text-xs hover:bg-black hover:text-[#e7e2d0] disabled:opacity-40"
                      title="위로">
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === experiences.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="px-2.5 py-1 bg-[#e7e2d0] cursor-pointer font-bold text-xs hover:bg-black hover:text-[#e7e2d0] disabled:opacity-40"
                      title="아래로">
                      ▼
                    </button>
                  </div>
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

              <div className="text-xs sm:text-sm text-neutral-600 font-mono font-semibold">
                📅 {exp.period || '기간 미지정'} | 📍 {exp.location || '위치 미지정'}
              </div>

              {/* Description Bullets preview */}
              <div className="mt-1">
                <p className="text-xs font-bold text-neutral-800 mb-1">
                  🇰🇷 국문 설명 요약 ({exp.description?.kr?.length || 0}개 항목):
                </p>
                <ul className="pl-4 m-0 text-xs sm:text-sm text-neutral-700 leading-relaxed list-disc">
                  {exp.description?.kr?.slice(0, 3).map((bullet, bIdx) => (
                    <li key={`preview-kr-${bIdx}`}>{bullet}</li>
                  ))}
                  {(exp.description?.kr?.length || 0) > 3 && (
                    <li className="text-neutral-400 italic list-none">
                      외 {exp.description.kr.length - 3}개 항목 더 있음...
                    </li>
                  )}
                </ul>
              </div>

              {/* Stacks tags preview */}
              {exp.stacks && exp.stacks.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1 pt-2 border-t border-black/10">
                  {exp.stacks.map((stk, sIdx) => (
                    <span key={`preview-stack-${stk}-${sIdx}`} className="text-[11px] font-bold border border-black px-2 py-0.5 bg-[#f5f0df]">
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
      <div className="pt-5 border-t-2 border-black flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-xs sm:text-sm text-neutral-600 font-mono">
          총 <strong>{experiences.length}</strong>개의 경력 항목이 등록되어 있습니다.
        </span>
        <button
          type="button"
          disabled={saveMutation.isPending}
          onClick={handleSaveAll}
          className="w-full sm:w-auto px-8 py-3.5 bg-black text-[#e7e2d0] border-2 border-black font-black text-sm uppercase cursor-pointer hover:bg-neutral-800 transition-colors shadow-[3px_3px_0px_#000000] disabled:opacity-50">
          {saveMutation.isPending ? '저장 처리 중...' : '💾 경력 사항 전체 저장'}
        </button>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#e7e2d0] border-4 border-black p-5 sm:p-7 w-full max-w-[780px] max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_#000000] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b-[3px] border-black pb-3">
              <h3 className="text-lg sm:text-xl font-black uppercase m-0">
                {editingIndex === -1 ? '새 경력 항목 추가' : `경력 수정: ${editItem.company}`}
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
                  <label className="text-xs font-black uppercase">회사명 (Company)</label>
                  <input
                    type="text"
                    value={editItem.company}
                    onChange={(e) => setEditItem({ ...editItem, company: e.target.value })}
                    placeholder="예: eBay, COS, Blocko"
                    className="w-full p-2.5 bg-white border-2 border-black text-sm font-semibold outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black uppercase">직책 / 역할 (Role / Position)</label>
                  <input
                    type="text"
                    value={editItem.role}
                    onChange={(e) => setEditItem({ ...editItem, role: e.target.value })}
                    placeholder="예: Front-End Developer / Software Engineer"
                    className="w-full p-2.5 bg-white border-2 border-black text-sm font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black uppercase">근무 기간 (Period)</label>
                  <input
                    type="text"
                    value={editItem.period}
                    onChange={(e) => setEditItem({ ...editItem, period: e.target.value })}
                    placeholder="예: 2023 - Present / 2021 - 2022"
                    className="w-full p-2.5 bg-white border-2 border-black text-sm font-semibold outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black uppercase">근무지 (Location)</label>
                  <input
                    type="text"
                    value={editItem.location}
                    onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                    placeholder="예: Seoul / Tokyo"
                    className="w-full p-2.5 bg-white border-2 border-black text-sm font-semibold outline-none"
                  />
                </div>
              </div>

              {/* English Bullets */}
              <div className="bg-white border-2 border-black p-4">
                <div className="flex justify-between items-center mb-3 border-b border-neutral-300 pb-2">
                  <label className="text-xs font-black uppercase">🇬🇧 영문 업무 및 성과 설명 (Bullet Points)</label>
                  <button
                    type="button"
                    onClick={() => handleAddBullet('en')}
                    className="px-3 py-1 bg-black text-[#e7e2d0] font-extrabold text-xs uppercase cursor-pointer hover:bg-neutral-800">
                    + 항목 추가
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {editItem.description.en.map((bullet, bIdx) => (
                    <div key={`admin-bullet-en-${bIdx}`} className="flex gap-2 items-start">
                      <span className="font-bold pt-2 text-xs">{bIdx + 1}.</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleBulletChange('en', bIdx, e.target.value)}
                        placeholder="Implemented responsive web features..."
                        className="flex-1 p-2 bg-[#fbf9f4] border border-black text-xs font-medium outline-none resize-y"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet('en', bIdx)}
                        className="p-2 text-red-600 cursor-pointer font-extrabold hover:bg-red-50">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Korean Bullets */}
              <div className="bg-white border-2 border-black p-4">
                <div className="flex justify-between items-center mb-3 border-b border-neutral-300 pb-2">
                  <label className="text-xs font-black uppercase">🇰🇷 국문 업무 및 성과 설명 (Bullet Points)</label>
                  <button
                    type="button"
                    onClick={() => handleAddBullet('kr')}
                    className="px-3 py-1 bg-black text-[#e7e2d0] font-extrabold text-xs uppercase cursor-pointer hover:bg-neutral-800">
                    + 항목 추가
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {editItem.description.kr.map((bullet, bIdx) => (
                    <div key={`admin-bullet-kr-${bIdx}`} className="flex gap-2 items-start">
                      <span className="font-bold pt-2 text-xs">{bIdx + 1}.</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleBulletChange('kr', bIdx, e.target.value)}
                        placeholder="성능 최적화 및 신규 화면 개발 진행..."
                        className="flex-1 p-2 bg-[#fbf9f4] border border-black text-xs font-medium outline-none resize-y"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet('kr', bIdx)}
                        className="p-2 text-red-600 cursor-pointer font-extrabold hover:bg-red-50">
                        ✕
                      </button>
                    </div>
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
