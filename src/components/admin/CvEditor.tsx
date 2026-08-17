'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CVDataType, getCVSettings, updateCVSettings } from '@/service/portfolioService';
import styles from '@/app/styles/Admin.module.css';

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

  // TanStack Query: fetch CV settings
  const { data: remoteCv, isLoading } = useQuery({
    queryKey: ['cvSettings'],
    queryFn: getCVSettings,
  });

  useEffect(() => {
    if (remoteCv) {
      setCvSettings(remoteCv);
    }
  }, [remoteCv]);

  // TanStack Query: mutation to save CV settings
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className={styles.editorHeader}>
        <div>
          <h2 className={styles.editorTitle}>이력서 (CV) 관리</h2>
          <p className={styles.editorSubtitle}>
            `/cv` 페이지의 PDF 이력서 다운로드 링크 및 소개(Summary) 문구를 관리합니다.
          </p>
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: '14px 20px',
            border: '2px solid #000000',
            fontWeight: 700,
            fontSize: '13px',
            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: message.type === 'success' ? '#065f46' : '#991b1b',
          }}>
          {message.text}
        </div>
      )}

      {/* Main Settings Card */}
      <div className={styles.itemCard}>
        {isLoading ? (
          <div style={{ padding: '30px', textAlign: 'center', fontFamily: 'monospace' }}>
            데이터를 불러오는 중입니다...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* PDF File URL / Upload */}
            <div className={styles.formGroup} style={{ margin: 0 }}>
              <label className={styles.label}>
                📄 PDF 이력서 링크 (Resume PDF URL)
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
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
                  className={styles.input}
                  style={{ flex: 1 }}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf"
                  style={{ display: 'none' }}
                  id="cv-pdf-upload-input"
                />
                <label
                  htmlFor="cv-pdf-upload-input"
                  className={styles.btnSecondary}
                  style={{ whiteSpace: 'nowrap' }}>
                  {uploading ? '업로드 중...' : '📁 PDF 파일 업로드'}
                </label>
              </div>

              {cvSettings.pdfUrl && (
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <a
                    href={cvSettings.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '13px',
                      color: 'blue',
                      textDecoration: 'underline',
                      fontWeight: 600,
                    }}>
                    📄 업로드된 PDF 파일 미리보기 ↗
                  </a>
                  {cvSettings.lastUpdated && (
                    <span style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
                      (최종 수정일: {cvSettings.lastUpdated})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* English Summary */}
            <div className={styles.formGroup} style={{ margin: 0 }}>
              <label className={styles.label}>
                🇬🇧 영문 이력서 소개 요약 (English CV Summary)
              </label>
              <textarea
                rows={4}
                value={cvSettings.summaryEn || ''}
                onChange={(e) =>
                  setCvSettings({ ...cvSettings, summaryEn: e.target.value })
                }
                placeholder="I'm a Creative Software Developer with..."
                className={styles.textarea}
              />
            </div>

            {/* Korean Summary */}
            <div className={styles.formGroup} style={{ margin: 0 }}>
              <label className={styles.label}>
                🇰🇷 국문 이력서 소개 요약 (Korean CV Summary)
              </label>
              <textarea
                rows={4}
                value={cvSettings.summaryKr || ''}
                onChange={(e) =>
                  setCvSettings({ ...cvSettings, summaryKr: e.target.value })
                }
                placeholder="인터랙티브 디자인과 고성능 웹 아키텍처에 열정을 가진 개발자로서..."
                className={styles.textarea}
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
        <button
          type="button"
          disabled={saveMutation.isPending}
          onClick={handleSave}
          className={styles.btnPrimary}
          style={{ padding: '14px 36px', fontSize: '15px' }}>
          {saveMutation.isPending ? '저장 처리 중...' : '💾 CV 설정 저장하기'}
        </button>
      </div>
    </div>
  );
}
