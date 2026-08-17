export interface EmailData {
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  message?: string;
  success?: boolean;
}

/**
 * Send contact inquiry email via API
 */
export async function sendContactEmail(
  emailData: EmailData
): Promise<ContactResponse> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || '이메일 전송에 실패하였습니다. 다시 시도해주세요.'
    );
  }

  return data;
}
