import React from 'react';
import ContactList from '@/components/ContactList';
import EmailForm from '@/components/EmailForm';
import PageWrap from '@/components/common/PageWrap';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Inquiries',
  description:
    'Get in touch with Younggeun Jun for software engineering roles, technical advisory, and creative collaborations.',
};

export default function ContactPage() {
  return (
    <PageWrap
      title="Get in Touch"
      subtitle="Open for Roles, Collaborations & Discussions">
      <div className="p-4 md:p-10 max-w-5xl mx-auto space-y-8">
        <ContactList />
        <EmailForm />
      </div>
    </PageWrap>
  );
}
