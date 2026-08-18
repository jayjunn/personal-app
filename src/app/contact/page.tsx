import React from 'react';
import { Metadata } from 'next';
import Contact from '../../components/Contact';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Younggeun Jun (jayjunn@outlook.com) for engineering roles and collaborations.',
};

export default function ContactPage() {
  return (
    <div>
      <Contact />
    </div>
  );
}
