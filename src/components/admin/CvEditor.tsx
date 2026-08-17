'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CVDataType, getCVSettings, updateCVSettings } from '@/service/portfolioService';

export default function CvEditor() {
  const queryClient = useQueryClient();
  const [cvSettings, setCvSettings] = useState<CVDataType>({
    pdfUrl: '',
    summaryEn: '',
    summaryKr: '',
    lastUpdated: '',
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: remoteCv, isLoading } = useQuery({
    queryKey: ['cvSettings'],
    queryFn: getCVSettings,
  });


  useEffect(() => {
    if (remoteCv) {
      setCvSettings(remoteCv);
    }
  }, [remoteCv]);


  const saveMutation = useMutation({
    mutationFn: (newCv: CVDataType) => updateCVSettings(newCv),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvSettings'] });
      setMessage({ text: 'CV 설정이 성공적으로 저장되었습니다! ✅', type: 'success' });
      setTimeout(() => setMessage(null), 3500);
    },
    onError: (err: any) => {
      console.error(err);
      setMessage({ text: `저장 실패: ${err.message || '오류 발생'}`, type: 'error' });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const uploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

    if (!uploadUrl || !uploadPreset) {
      alert('Cloudinary 환경변수가 설정되어 있지 않습니다. PDF URL을 직접 입력해주세요.');
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

      if (!res.ok) throw new Error('PDF upload failed');
      const data = await res.json();
      if (data.secure_url) {
        setCvSettings((prev) => ({
          ...prev,
          pdfUrl: data.secure_url,
          lastUpdated: new Date().toLocaleDateString(),
        }));
      }
    } catch (err: any) {
      console.error(err);
      alert('PDF 업로드 실패: ' + (err.message || '오류 발생'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    setMessage(null);
    saveMutation.mutate(cvSettings);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="border-b-2 border-black pb-4">
        <h2 className="text-xl sm:text-2xl font-black uppercase m-0 tracking-tight">
          이력서 (CV) 관리
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 font-semibold mt-1">
          `/cv` 페이지의 PDF 이력서 다운로드 링크 및 소개(Summary) 문구를 관리합니다.
        </p>
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

      {/* Main Settings Card */}
      <div className="border-[3px] border-black bg-white p-4 sm:p-6 shadow-[4px_4px_0px_#000000]">
        {isLoading ? (
          <div className="p-8 text-center font-mono text-sm">
            데이터를 불러오는 중입니다...
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* PDF File URL / Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase text-neutral-800">
                📄 PDF 이력서 링크 (Resume PDF URL)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={cvSettings.pdfUrl || ''}
                  onChange={(e) =>
                    setCvSettings({
                      ...cvSettings,
                      pdfUrl: e.target.value,
                      lastUpdated: new Date().toLocaleDateString(),
                    })
                  }
                  placeholder="https://res.cloudinary.com/.../resume.pdf"
                  className="flex-1 p-3 bg-[#fbf9f4] border-2 border-black text-sm font-semibold outline-none focus:bg-white"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf"
                  className="hidden"
                  id="cv-pdf-upload-input"
                />
                <label
                  htmlFor="cv-pdf-upload-input"
                  className="px-4 py-3 bg-[#e7e2d0] border-2 border-black text-black font-extrabold text-xs uppercase cursor-pointer hover:bg-black hover:text-[#e7e2d0] transition-colors whitespace-nowrap text-center shadow-[2px_2px_0px_#000000]">
                  {uploading ? '업로드 중...' : '📁 PDF 파일 업로드'}
                </label>
              </div>

              {cvSettings.pdfUrl && (
                <div className="mt-2.5 flex items-center gap-3 flex-wrap">
                  <a
                    href={cvSettings.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs sm:text-sm text-blue-700 underline font-bold hover:text-blue-900">
                    📄 업로드된 PDF 파일 미리보기 ↗
                  </a>
                  {cvSettings.lastUpdated && (
                    <span className="text-xs text-neutral-500 font-mono">
                      (최종 수정일: {cvSettings.lastUpdated})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* English Summary */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase text-neutral-800">
                🇬🇧 영문 이력서 소개 요약 (English CV Summary)
              </label>
              <textarea
                rows={4}
                value={cvSettings.summaryEn || ''}
                onChange={(e) =>
                  setCvSettings({ ...cvSettings, summaryEn: e.target.value })
                }
                placeholder="I'm a Creative Software Developer with..."
                className="w-full p-3 bg-[#fbf9f4] border-2 border-black text-sm font-semibold outline-none focus:bg-white resize-y"
              />
            </div>

            {/* Korean Summary */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase text-neutral-800">
                🇰🇷 국문 이력서 소개 요약 (Korean CV Summary)
              </label>
              <textarea
                rows={4}
                value={cvSettings.summaryKr || ''}
                onChange={(e) =>
                  setCvSettings({ ...cvSettings, summaryKr: e.target.value })
                }
                placeholder="인터랙티브 디자인과 고성능 웹 아키텍처에 열정을 가진 개발자로서..."
                className="w-full p-3 bg-[#fbf9f4] border-2 border-black text-sm font-semibold outline-none focus:bg-white resize-y"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          disabled={saveMutation.isPending}
          onClick={handleSave}
          className="w-full sm:w-auto px-8 py-3.5 bg-black text-[#e7e2d0] border-2 border-black font-black text-sm uppercase cursor-pointer hover:bg-neutral-800 transition-colors shadow-[3px_3px_0px_#000000] disabled:opacity-50">
          {saveMutation.isPending ? '저장 처리 중...' : '💾 CV 설정 저장하기'}
        </button>
      </div>
    </div>
  );
}
