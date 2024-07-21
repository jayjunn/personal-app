export type EmailData = {
  email: string;
  subject: string;
  message: string;
};

export async function sendContactEmail(email: EmailData) {
  const res = await fetch(`/api/contact`, {
    method: 'POST',
    body: JSON.stringify(email),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `이메일 전송에 실패하였습니다. 다시 시도해주세요.`);
  }

  return data;
}
