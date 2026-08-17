import React from 'react';
import Contact from '../../components/Contact';

// Next.js ISR (Incremental Static Regeneration)
export const revalidate = 60;

export default function ContactPage() {
  return (
    <div>
      <Contact />
    </div>
  );
}
