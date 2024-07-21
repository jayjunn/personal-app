import { sendEmail } from '@/app/service/email';
import * as yup from 'yup';
const bodySchema = yup.object().shape({
  email: yup.string().email().required(),
  subject: yup.string().required(),
  message: yup.string().required(),
});

const setResponse = (message: string, status: number) => {
  return new Response(JSON.stringify({ message }), {
    status,
  });
};

export async function POST(req: Request) {
  const body = await req.json();

  if (!bodySchema.isValidSync(body)) {
    return setResponse(`유효하지 않은 포맷입니다.`, 400);
  }

  return sendEmail(body) //
    .then(() => setResponse(`메일이 성공적으로 보내졌습니다.`, 200))
    .catch((error) => {
      console.error(error);
      return setResponse(`메일이 보내기에 실패하였습니다.`, 500);
    });
}
