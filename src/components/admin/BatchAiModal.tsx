'use client';

import React, { useState, useEffect } from 'react';
import { WorkItem, ExperienceItem } from '@/service/portfolioService';

interface BatchAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'works' | 'experiences';
  originalItems: any[];
  onApplyAll: (newItems: any[]) => void;
}

export default function BatchAiModal({
  isOpen,
  onClose,
  type,
  originalItems,
  onApplyAll,
}: BatchAiModalProps) {
  const [loading, setLoading] = useState(false);
  const [processedItems, setProcessedItems] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const title =
    type === 'works'
      ? '🚀 전체 프로젝트 일괄 AI 다듬기 & 번역'
      : '💼 전체 경력 사항 일괄 AI 다듬기 & 번역';

  useEffect(() => {
    if (isOpen && originalItems.length > 0) {
      handleStartBatch(originalItems);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartBatch = async (itemsToProcess = originalItems) => {
    setLoading(true);
    setErrorMessage(null);
    setProcessedItems([]);

    try {
      const res = await fetch('/api/ai-batch-polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          items: itemsToProcess,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '일괄 처리 중 오류가 발생했습니다.');
      }

      setProcessedItems(data.items || []);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || '일괄 처리 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (processedItems.length > 0) {
      onApplyAll(processedItems);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-4xl bg-[#e7e2d0] border-[4px] border-black p-5 sm:p-7 shadow-[10px_10px_0px_#000000] flex flex-col gap-5 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start border-b-[3px] border-black pb-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-black text-[#e7e2d0] font-mono font-black text-xs uppercase tracking-wider">
                BATCH AI POLISHER
              </span>
              <span className="px-2 py-0.5 bg-yellow-300 border border-black font-mono font-black text-xs uppercase">
                총 {originalItems.length}개 항목 일괄 변환
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight m-0">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-700 font-semibold m-0">
              모든 항목의 국문/영문 설명을 글로벌 테크 수준으로 다듬고, 불릿 및 기술 스택을 일괄 최적화합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white font-black text-sm hover:bg-rose-500 hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_#000000]">
            ✕
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="p-12 bg-white border-2 border-black flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-10 h-10 border-4 border-black border-t-yellow-400 rounded-full animate-spin" />
            <div className="flex flex-col gap-1">
              <span className="font-black text-sm uppercase">
                ⚡ Gemini AI가 {originalItems.length}개의 전체 항목을 분석하고 있습니다...
              </span>
              <span className="font-mono text-xs text-neutral-600">
                STAR 기법 적용, 글로벌 영문 번역, 기술 스택 추출 및 불릿 포인트 일괄 정제 중
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 bg-rose-100 border-2 border-black text-rose-900 text-xs sm:text-sm font-bold flex justify-between items-center">
            <span>⚠️ {errorMessage}</span>
            <button
              type="button"
              onClick={() => handleStartBatch()}
              className="px-3 py-1 bg-black text-white text-xs font-bold uppercase cursor-pointer">
              다시 시도
            </button>
          </div>
        )}

        {/* Comparison List View (After Batch Processing) */}
        {!loading && processedItems.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-[#ded8c4] p-3 border-2 border-black">
              <span className="font-black text-xs uppercase">
                ✨ 변환 결과 미리보기 (Before & After Preview)
              </span>
              <span className="font-mono text-xs font-bold text-emerald-800">
                ✓ {processedItems.length}개 항목 일괄 변환 완료
              </span>
            </div>

            <div className="flex flex-col gap-4 max-h-[480px] overflow-y-auto pr-1">
              {processedItems.map((item, idx) => {
                const orig = originalItems[idx] || {};
                const name = item.name || item.company || `항목 #${idx + 1}`;

                return (
                  <div
                    key={idx}
                    className="p-4 bg-white border-2 border-black flex flex-col gap-3 shadow-[3px_3px_0px_#000000]">
                    <div className="flex justify-between items-center border-b border-neutral-300 pb-2">
                      <span className="font-black text-sm uppercase">
                        #{idx + 1}. {name} {item.role ? `(${item.role})` : ''}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-800 text-emerald-900 font-mono font-bold text-xs">
                        업그레이드 완료 ✨
                      </span>
                    </div>

                    {/* Works Type Preview */}
                    {type === 'works' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 bg-[#fbf9f4] border border-black/30 flex flex-col gap-1">
                          <span className="font-black text-[11px] text-neutral-600">
                            🇰🇷 다듬어진 국문 설명:
                          </span>
                          <p className="m-0 leading-relaxed font-medium">
                            {item.description?.kr || '설명 없음'}
                          </p>
                        </div>
                        <div className="p-2.5 bg-[#fbf9f4] border border-black/30 flex flex-col gap-1">
                          <span className="font-black text-[11px] text-neutral-600">
                            🇬🇧 다듬어진 영문 설명:
                          </span>
                          <p className="m-0 leading-relaxed font-medium">
                            {item.description?.en || '설명 없음'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Experiences Type Preview */}
                    {type === 'experiences' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 bg-[#fbf9f4] border border-black/30 flex flex-col gap-1">
                          <span className="font-black text-[11px] text-neutral-600">
                            🇰🇷 다듬어진 국문 불릿:
                          </span>
                          <ul className="pl-4 m-0 list-disc leading-relaxed">
                            {Array.isArray(item.description?.kr)
                              ? item.description.kr.map((b: string, bI: number) => (
                                  <li key={bI}>{b}</li>
                                ))
                              : <li>{item.description?.kr}</li>}
                          </ul>
                        </div>
                        <div className="p-2.5 bg-[#fbf9f4] border border-black/30 flex flex-col gap-1">
                          <span className="font-black text-[11px] text-neutral-600">
                            🇬🇧 다듬어진 영문 불릿:
                          </span>
                          <ul className="pl-4 m-0 list-disc leading-relaxed">
                            {Array.isArray(item.description?.en)
                              ? item.description.en.map((b: string, bI: number) => (
                                  <li key={bI}>{b}</li>
                                ))
                              : <li>{item.description?.en}</li>}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Stacks Preview */}
                    {item.stacks && item.stacks.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[11px] font-bold text-neutral-500 mr-1 self-center">
                          스택:
                        </span>
                        {item.stacks.map((stk: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 bg-[#ded8c4] border border-black text-[10px] font-bold">
                            {stk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-3 border-t-2 border-black flex-wrap gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleStartBatch()}
            className="px-4 py-2.5 bg-white text-black border-2 border-black font-extrabold text-xs uppercase cursor-pointer hover:bg-neutral-100 transition-colors shadow-[2px_2px_0px_#000000]">
            🔄 전체 다시 생성
          </button>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white text-black border-2 border-black font-extrabold text-xs uppercase cursor-pointer hover:bg-neutral-100 transition-colors shadow-[2px_2px_0px_#000000]">
              취소
            </button>
            <button
              type="button"
              disabled={loading || processedItems.length === 0}
              onClick={handleApply}
              className="px-6 py-2.5 bg-black text-[#e7e2d0] border-2 border-black font-black text-xs sm:text-sm uppercase cursor-pointer hover:bg-neutral-800 transition-colors shadow-[4px_4px_0px_#000000] disabled:opacity-50 flex items-center gap-2">
              <span>✨ 전체 목록에 한 번에 적용 (Apply All)</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
