import nodemailer from 'nodemailer';
import { EmailData } from './contact';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export async function sendEmail({ email: from, message, subject }: EmailData) {
  const mailData = {
    from,
    to: process.env.GMAIL_EMAIL, // list of receivers
    subject: `[Younggeun Jun]${subject}`, // Subject line
    html: `
		<h1>${subject}</h1>
		<div>${message}</div>
		<br/>4
		<p>from: ${from}</p>
		`,
  };

  return transporter.sendMail(mailData);
}
