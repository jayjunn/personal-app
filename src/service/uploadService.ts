export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  [key: string]: unknown;
}

/**
 * Upload image or document to Cloudinary
 */
export async function uploadToCloudinary(
  file: File
): Promise<CloudinaryUploadResponse> {
  const uploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

  if (!uploadUrl || !uploadPreset) {
    throw new Error(
      'Cloudinary 환경변수가 설정되어 있지 않습니다. URL을 직접 입력해주세요.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      (errorData as { error?: { message?: string } })?.error?.message ||
        '파일 업로드에 실패했습니다.'
    );
  }

  return res.json();
}
