import React from 'react';
import CreativeLab from '@/components/CreativeLab';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creative Lab & Interactive Experiments',
  description:
    'Explore interactive web experiments, HTML5 Canvas particles, 3D CSS physics, and Web Audio API synthesizers by Younggeun Jun.',
};

export default function LabPage() {
  return <CreativeLab />;
}
