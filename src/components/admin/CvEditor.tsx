'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CVDataType, getCVSettings, updateCVSettings } from '@/service/portfolioService';
import styles from '@/app/styles/Admin.module.css';

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
      setMessage({ text: 'CV 및 이력서 설정이 성공적으로 저장되었습니다! ✅', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setMessage({ text: `저장 실패: ${err.message || '오류 발생'}`, type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div className={styles.editorHeader}>
        <div>
          <h2 className={styles.editorTitle}>이력서 (CV) 설정</h2>
          <p className={styles.editorSubtitle}>
            `/cv` 페이지의 PDF 다운로드 파일 링크 및 소개 요약문을 관리합니다.
          </p>
        </div>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* PDF Link & Upload */}
        <div className={styles.formGroup} style={{ margin: 0 }}>
          <label className={styles.label}>PDF 이력서 파일 (PDF File URL)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={cvSettings.pdfUrl || ''}
              onChange={(e) => setCvSettings({ ...cvSettings, pdfUrl: e.target.value })}
              placeholder="https://.../resume.pdf"
              className={styles.input}
              style={{ flex: 1 }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="application/pdf"
              style={{ display: 'none' }}
              id="pdf-upload-input"
            />
            <label
              htmlFor="pdf-upload-input"
              className={styles.btnSecondary}
              style={{ whiteSpace: 'nowrap' }}>
              {uploading ? '업로드 중...' : '📄 PDF 파일 업로드'}
            </label>
          </div>
          {cvSettings.pdfUrl && (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>✓ PDF 파일 등록됨</span>
              <a
                href={cvSettings.pdfUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '13px', fontWeight: 700, textDecoration: 'underline' }}>
                등록된 PDF 열기 ↗
              </a>
            </div>
          )}
        </div>

        {/* Summaries */}
        <div className={styles.grid2}>
          <div className={styles.formGroup} style={{ margin: 0 }}>
            <label className={styles.label}>
              CV 상단 요약문 <span>[EN Summary]</span>
            </label>
            <textarea
              rows={5}
              value={cvSettings.summaryEn || ''}
              onChange={(e) => setCvSettings({ ...cvSettings, summaryEn: e.target.value })}
              placeholder="Software engineer with strong experience..."
              className={styles.textarea}
            />
          </div>
          <div className={styles.formGroup} style={{ margin: 0 }}>
            <label className={styles.label}>
              CV 상단 요약문 <span>[KR Summary]</span>
            </label>
            <textarea
              rows={5}
              value={cvSettings.summaryKr || ''}
              onChange={(e) => setCvSettings({ ...cvSettings, summaryKr: e.target.value })}
              placeholder="뛰어난 사용자 경험과 안정적인 서비스를 지향하는..."
              className={styles.textarea}
            />
          </div>
        </div>

        {cvSettings.lastUpdated && (
          <div style={{ fontSize: '13px', color: '#555', fontFamily: 'monospace' }}>
            마지막 업데이트 일자: <strong>{cvSettings.lastUpdated}</strong>
          </div>
        )}

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
            * 변경 사항은 `/cv` 페이지에 즉시 적용됩니다.
          </span>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className={styles.btnPrimary}
            style={{ padding: '14px 32px', fontSize: '14px' }}>
            {saving ? '저장 처리 중...' : '💾 CV 설정 전체 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
