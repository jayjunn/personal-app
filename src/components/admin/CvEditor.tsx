'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CVDataType, getCVSettings, updateCVSettings } from '@/service/portfolioService';

export default function CvEditor() {
  const [cvSettings, setCvSettings] = useState<CVDataType>({
    pdfUrl: '',
    summaryEn: '',
    summaryKr: '',
    lastUpdated: '',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getCVSettings().then((data) => {
      if (data) setCvSettings(data);
    });
  }, []);

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

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload: CVDataType = {
        ...cvSettings,
        lastUpdated: new Date().toLocaleDateString(),
      };
      await updateCVSettings(payload);
      setCvSettings(payload);
      setMessage({ text: 'CV 설정이 성공적으로 저장되었습니다! ✅', type: 'success' });
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
          <h2 className="text-xl md:text-2xl font-bold uppercase">이력서 (CV) 다운로드 및 설정</h2>
          <p className="text-sm text-gray-700 mt-1">
            `/cv` 페이지의 PDF 다운로드 파일 링크 및 이력서 설정을 관리합니다.
          </p>
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

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2">
            PDF 이력서 파일 링크 (PDF URL)
          </label>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              value={cvSettings.pdfUrl || ''}
              onChange={(e) => setCvSettings({ ...cvSettings, pdfUrl: e.target.value })}
              placeholder="https://.../resume.pdf"
              className="flex-1 p-3 bg-white border-2 border-black font-mono text-sm"
            />
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="application/pdf"
                className="hidden"
                id="pdf-upload-input"
              />
              <label
                htmlFor="pdf-upload-input"
                className="px-4 py-2 border-2 border-black bg-white font-bold text-xs cursor-pointer hover:bg-gray-100 flex items-center justify-center whitespace-nowrap">
                {uploading ? '업로드 중...' : '📄 PDF 파일 업로드'}
              </label>
            </div>
          </div>
          {cvSettings.pdfUrl && (
            <p className="mt-2 text-xs text-blue-700 underline">
              <a href={cvSettings.pdfUrl} target="_blank" rel="noreferrer">
                등록된 PDF 바로보기 ↗
              </a>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2">
              CV 상단 요약문 (EN Summary)
            </label>
            <textarea
              rows={4}
              value={cvSettings.summaryEn || ''}
              onChange={(e) => setCvSettings({ ...cvSettings, summaryEn: e.target.value })}
              placeholder="Software engineer with strong experience..."
              className="w-full p-3 bg-white border-2 border-black text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2">
              CV 상단 요약문 (KR Summary)
            </label>
            <textarea
              rows={4}
              value={cvSettings.summaryKr || ''}
              onChange={(e) => setCvSettings({ ...cvSettings, summaryKr: e.target.value })}
              placeholder="뛰어난 사용자 경험과 안정적인 서비스를 지향하는..."
              className="w-full p-3 bg-white border-2 border-black text-sm"
            />
          </div>
        </div>

        {cvSettings.lastUpdated && (
          <div className="text-xs text-gray-500 font-mono">
            마지막 업데이트: {cvSettings.lastUpdated}
          </div>
        )}

        <div className="pt-4 border-t-2 border-black flex justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="brutal-btn px-8 py-3 text-base">
            {saving ? '저장 중...' : 'CV 설정 저장 💾'}
          </button>
        </div>
      </div>
    </div>
  );
}
