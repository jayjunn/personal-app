'use client';

import React, { useState, useEffect } from 'react';
import { ExperienceItem, getExperiences, updateExperiences } from '@/service/portfolioService';
import { experienceData as defaultExperiences } from '@/data/portfolioData';

export default function ExperienceEditor() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(defaultExperiences as unknown as ExperienceItem[]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<ExperienceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    getExperiences().then((data) => {
      if (data) setExperiences(data);
    });
  }, []);

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
    setEditingIndex(-1); // -1 means new item
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditItem(JSON.parse(JSON.stringify(experiences[index])));
  };

  const handleDelete = (index: number) => {
    if (confirm(`'${experiences[index].company}' 경력을 정말 삭제하시겠습니까?`)) {
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

  // Editing form handlers
  const handleBulletChange = (lang: 'en' | 'kr', bIndex: number, val: string) => {
    if (!editItem) return;
    const updatedList = [...(editItem.description[lang] || [])];
    updatedList[bIndex] = val;
    setEditItem({
      ...editItem,
      description: {
        ...editItem.description,
        [lang]: updatedList,
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
    const updatedList = editItem.description[lang].filter((_, i) => i !== bIndex);
    setEditItem({
      ...editItem,
      description: {
        ...editItem.description,
        [lang]: updatedList,
      },
    });
  };

  const handleSaveModal = () => {
    if (!editItem) return;
    if (!editItem.company.trim() || !editItem.role.trim()) {
      alert('회사명과 직책(Role)을 입력해주세요.');
      return;
    }

    // Filter empty bullet points
    const cleanItem: ExperienceItem = {
      ...editItem,
      description: {
        en: editItem.description.en.filter((b) => b.trim() !== ''),
        kr: editItem.description.kr.filter((b) => b.trim() !== ''),
      },
    };

    let updatedList: ExperienceItem[];
    if (editingIndex === -1) {
      updatedList = [cleanItem, ...experiences];
    } else if (editingIndex !== null) {
      updatedList = [...experiences];
      updatedList[editingIndex] = cleanItem;
    } else {
      return;
    }

    setExperiences(updatedList);
    setEditingIndex(null);
    setEditItem(null);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateExperiences(experiences);
      setMessage({ text: '경력 사항이 성공적으로 저장되었습니다! ✅', type: 'success' });
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
          <h2 className="text-xl md:text-2xl font-bold uppercase">경력 (Experience) 관리</h2>
          <p className="text-sm text-gray-700 mt-1">
            홈 화면 및 CV에 표시되는 회사 및 개발/직무 경력 리스트를 관리합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleStartAdd}
            className="brutal-btn">
            + 경력 추가하기
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

      {/* Experience List */}
      <div className="space-y-4 mb-8">
        {experiences.length === 0 ? (
          <div className="p-8 text-center bg-white/50 border-2 border-dashed border-black">
            등록된 경력이 없습니다. [경력 추가하기] 버튼을 눌러 추가해주세요.
          </div>
        ) : (
          experiences.map((exp, idx) => (
            <div
              key={idx}
              className="bg-white p-5 border-2 border-black shadow-[3px_3px_0px_#0c0c0c] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-black text-[#e7e2d0] px-2 py-0.5 font-bold">
                    #{idx + 1}
                  </span>
                  <h3 className="text-lg font-bold">
                    {exp.role} <span className="text-gray-500 font-normal">@</span> {exp.company}
                  </h3>
                </div>
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p>• 영문 업무 항목: {exp.description?.en?.length || 0}개</p>
                  <p>• 국문 업무 항목: {exp.description?.kr?.length || 0}개</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="px-2.5 py-1.5 border border-black text-xs font-bold bg-[#e7e2d0] disabled:opacity-30"
                  title="위로 이동">
                  ▲
                </button>
                <button
                  type="button"
                  disabled={idx === experiences.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="px-2.5 py-1.5 border border-black text-xs font-bold bg-[#e7e2d0] disabled:opacity-30"
                  title="아래로 이동">
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => handleStartEdit(idx)}
                  className="px-3 py-1.5 border-2 border-black text-xs font-bold bg-yellow-200 hover:bg-yellow-300">
                  수정 ✏️
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="px-3 py-1.5 border-2 border-black text-xs font-bold bg-red-200 hover:bg-red-300">
                  삭제 🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-4 border-t-2 border-black flex justify-between items-center">
        <span className="text-xs text-gray-600 font-medium">총 {experiences.length}개의 경력이 등록되어 있습니다.</span>
        <button
          type="button"
          disabled={saving}
          onClick={handleSaveAll}
          className="brutal-btn px-8 py-3 text-base">
          {saving ? '저장 중...' : '경력 사항 전체 저장 💾'}
        </button>
      </div>

      {/* Edit / Add Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="brutal-card bg-[#f2eee0] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative my-8">
            <h3 className="text-xl font-bold border-b-2 border-black pb-3 mb-6 uppercase">
              {editingIndex === -1 ? '신규 경력 추가' : `경력 수정: ${editItem.company}`}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">직책 / 역할 (Role)</label>
                  <input
                    type="text"
                    value={editItem.role}
                    onChange={(e) => setEditItem({ ...editItem, role: e.target.value })}
                    placeholder="예: Software Engineer / Front-end Developer"
                    className="w-full p-2.5 bg-white border-2 border-black text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">회사명 (Company)</label>
                  <input
                    type="text"
                    value={editItem.company}
                    onChange={(e) => setEditItem({ ...editItem, company: e.target.value })}
                    placeholder="예: eBay Japan / Blocko"
                    className="w-full p-2.5 bg-white border-2 border-black text-sm"
                  />
                </div>
              </div>

              {/* English Bullet points */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase">영문 업무 및 성과 설명 (EN Bullets)</label>
                  <button
                    type="button"
                    onClick={() => handleAddBullet('en')}
                    className="text-xs font-bold px-2 py-1 bg-black text-[#e7e2d0]">
                    + 항목 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {editItem.description.en.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex gap-2 items-start">
                      <span className="text-xs font-bold py-2 font-mono">{bIdx + 1}.</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleBulletChange('en', bIdx, e.target.value)}
                        placeholder="Implemented..."
                        className="flex-1 p-2 bg-white border-2 border-black text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet('en', bIdx)}
                        className="p-1 text-red-600 hover:font-bold text-sm"
                        title="항목 제거">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Korean Bullet points */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase">국문 업무 및 성과 설명 (KR Bullets)</label>
                  <button
                    type="button"
                    onClick={() => handleAddBullet('kr')}
                    className="text-xs font-bold px-2 py-1 bg-black text-[#e7e2d0]">
                    + 항목 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {editItem.description.kr.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex gap-2 items-start">
                      <span className="text-xs font-bold py-2 font-mono">{bIdx + 1}.</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleBulletChange('kr', bIdx, e.target.value)}
                        placeholder="성능 최적화 및 신규 기능 개발..."
                        className="flex-1 p-2 bg-white border-2 border-black text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet('kr', bIdx)}
                        className="p-1 text-red-600 hover:font-bold text-sm"
                        title="항목 제거">
                        ✕
                      </button>
                    </div>
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
