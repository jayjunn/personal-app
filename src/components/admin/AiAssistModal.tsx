'use client';

import React, { useState, useEffect } from 'react';
import { AiPolishMode } from '@/app/api/ai-polish/route';

interface AiAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  fieldLabel: string;
  contextType: 'profile' | 'experience' | 'works' | 'cv' | 'general';
  defaultMode?: AiPolishMode;
  onApplyText?: (text: string) => void;
  onApplyStacks?: (stacks: string[]) => void;
}

export default function AiAssistModal({
  isOpen,
  onClose,
  initialText,
  fieldLabel,
  contextType,
  defaultMode = 'polish',
  onApplyText,
  onApplyStacks,
}: AiAssistModalProps) {
  const [inputText, setInputText] = useState(initialText);
  const [selectedMode, setSelectedMode] = useState<AiPolishMode>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [extractedStacks, setExtractedStacks] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputText(initialText || '');
      setSelectedMode(defaultMode);
      setResultText('');
      setExtractedStacks([]);
      setErrorMessage(null);
      setCopied(false);

      // Automatically trigger generation if initial text exists
      if (initialText && initialText.trim().length > 0) {
        handleGenerate(initialText, defaultMode);
      }
    }
  }, [isOpen, initialText, defaultMode]);

  if (!isOpen) return null;

  const handleGenerate = async (textToProcess = inputText, modeToUse = selectedMode) => {
    if (!textToProcess || !textToProcess.trim()) {
      setErrorMessage('처리할 텍스트를 입력해주세요.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setResultText('');
    setExtractedStacks([]);

    try {
      const res = await fetch('/api/ai-polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToProcess,
          mode: modeToUse,
          contextType,
          fieldLabel,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI 요청 중 오류가 발생했습니다.');
      }

      setResultText(data.result || '');
      if (data.stacks && Array.isArray(data.stacks)) {
        setExtractedStacks(data.stacks);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'AI 처리 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (resultText && onApplyText) {
      onApplyText(resultText);
    }
    if (extractedStacks.length > 0 && onApplyStacks) {
      onApplyStacks(extractedStacks);
    }
    onClose();
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-[#e7e2d0] border-[3.5px] border-black p-5 sm:p-7 shadow-[8px_8px_0px_#000000] flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-black text-[#e7e2d0] font-mono font-black text-xs uppercase tracking-wider">
                GEMINI AI COPILOT
              </span>
              <span className="px-2 py-0.5 bg-yellow-300 border border-black font-mono font-black text-xs uppercase">
                {fieldLabel || 'CONTENT ASSISTANT'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight m-0">
              AI 콘텐츠 다듬기 & 번역기
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white font-black text-sm hover:bg-rose-500 hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_#000000]">
            ✕
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b-2 border-black pb-3">
          <button
            type="button"
            onClick={() => {
              setSelectedMode('polish');
              handleGenerate(inputText, 'polish');
            }}
            className={`px-3 py-1.5 font-black text-xs uppercase border-2 border-black transition-all cursor-pointer ${
              selectedMode === 'polish'
                ? 'bg-black text-[#e7e2d0] shadow-[2px_2px_0px_#000000]'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}>
            ✨ 전문적으로 다듬기
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMode('translate-en');
              handleGenerate(inputText, 'translate-en');
            }}
            className={`px-3 py-1.5 font-black text-xs uppercase border-2 border-black transition-all cursor-pointer ${
              selectedMode === 'translate-en'
                ? 'bg-black text-[#e7e2d0] shadow-[2px_2px_0px_#000000]'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}>
            🇬🇧 영문 번역
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMode('translate-kr');
              handleGenerate(inputText, 'translate-kr');
            }}
            className={`px-3 py-1.5 font-black text-xs uppercase border-2 border-black transition-all cursor-pointer ${
              selectedMode === 'translate-kr'
                ? 'bg-black text-[#e7e2d0] shadow-[2px_2px_0px_#000000]'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}>
            🇰🇷 국문 번역
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMode('bulletize');
              handleGenerate(inputText, 'bulletize');
            }}
            className={`px-3 py-1.5 font-black text-xs uppercase border-2 border-black transition-all cursor-pointer ${
              selectedMode === 'bulletize'
                ? 'bg-black text-[#e7e2d0] shadow-[2px_2px_0px_#000000]'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}>
            📌 불릿포인트 변환
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMode('summarize');
              handleGenerate(inputText, 'summarize');
            }}
            className={`px-3 py-1.5 font-black text-xs uppercase border-2 border-black transition-all cursor-pointer ${
              selectedMode === 'summarize'
                ? 'bg-black text-[#e7e2d0] shadow-[2px_2px_0px_#000000]'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}>
            ✂️ 1줄 요약
          </button>

          {onApplyStacks && (
            <button
              type="button"
              onClick={() => {
                setSelectedMode('extract-stacks');
                handleGenerate(inputText, 'extract-stacks');
              }}
              className={`px-3 py-1.5 font-black text-xs uppercase border-2 border-black transition-all cursor-pointer ${
                selectedMode === 'extract-stacks'
                  ? 'bg-blue-600 text-white shadow-[2px_2px_0px_#000000]'
                  : 'bg-white text-blue-700 hover:bg-blue-50'
              }`}>
              🏷️ 기술스택 추출
            </button>
          )}
        </div>

        {/* Input Draft Area */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-black uppercase text-neutral-800">
              원본 텍스트 (Draft / Source)
            </label>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleGenerate(inputText, selectedMode)}
              className="text-xs font-extrabold text-blue-700 hover:underline cursor-pointer">
              🔄 다시 실행
            </button>
          </div>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="다듬고 싶은 텍스트를 입력하거나 수정하세요..."
            className="w-full p-3 bg-white border-2 border-black font-mono text-xs sm:text-sm focus:outline-none focus:bg-amber-50/50"
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 bg-rose-100 border-2 border-black text-rose-900 text-xs font-bold">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Result Area */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-black uppercase text-neutral-800 flex items-center gap-1.5">
              <span>✨ AI 추천 결과 (AI Generated Result)</span>
              {loading && <span className="animate-spin text-sm">⏳</span>}
            </label>
            {resultText && (
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-extrabold text-neutral-700 hover:text-black cursor-pointer">
                {copied ? '✅ 복사 완료!' : '📋 복사'}
              </button>
            )}
          </div>

          {loading ? (
            <div className="w-full p-8 bg-white border-2 border-black flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
              <p className="font-mono text-xs font-bold text-neutral-700 m-0">
                Gemini AI가 최적의 문장과 표현을 생성하고 있습니다...
              </p>
            </div>
          ) : (
            <textarea
              rows={5}
              value={resultText}
              onChange={(e) => setResultText(e.target.value)}
              placeholder="AI 결과물이 여기에 표시됩니다. 직접 수정도 가능합니다."
              className="w-full p-3.5 bg-white border-2 border-black font-mono text-xs sm:text-sm focus:outline-none focus:bg-emerald-50/30 text-neutral-900 leading-relaxed"
            />
          )}

          {/* Extracted Stacks Preview */}
          {extractedStacks.length > 0 && (
            <div className="mt-2 p-3 bg-white border-2 border-black flex flex-col gap-2">
              <span className="text-xs font-black uppercase text-blue-900">
                추출된 기술 스택 태그 ({extractedStacks.length}개):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {extractedStacks.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-blue-100 border border-blue-900 font-mono font-bold text-xs text-blue-900">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2.5 pt-2 border-t-2 border-black">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white text-black border-2 border-black font-extrabold text-xs uppercase cursor-pointer hover:bg-neutral-100 transition-colors shadow-[2px_2px_0px_#000000]">
            취소
          </button>
          <button
            type="button"
            disabled={loading || (!resultText && extractedStacks.length === 0)}
            onClick={handleApply}
            className="px-5 py-2.5 bg-black text-[#e7e2d0] border-2 border-black font-black text-xs uppercase cursor-pointer hover:bg-neutral-800 transition-colors shadow-[3px_3px_0px_#000000] disabled:opacity-50 flex items-center gap-1.5">
            <span>✨ 즉시 적용 (Apply to Form)</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
