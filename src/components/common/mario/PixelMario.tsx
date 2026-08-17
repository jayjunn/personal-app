'use client';

import React from 'react';

interface PixelMarioProps {
  isJumping: boolean;
}

export default function PixelMario({ isJumping }: PixelMarioProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="52"
      height="52"
      className="[image-rendering:pixelated] [shape-rendering:crispEdges]"
    >
      {/* Red Cap */}
      <rect x="3" y="1" width="5" height="1" fill="#e11d48" />
      <rect x="2" y="2" width="9" height="1" fill="#e11d48" />

      {/* Brown Hair / Face */}
      <rect x="2" y="3" width="3" height="1" fill="#6d4c41" />
      <rect x="5" y="3" width="2" height="1" fill="#fcd34d" />
      <rect x="7" y="3" width="1" height="1" fill="#000000" />
      <rect x="8" y="3" width="1" height="1" fill="#fcd34d" />

      <rect x="1" y="4" width="1" height="1" fill="#6d4c41" />
      <rect x="2" y="4" width="1" height="1" fill="#fcd34d" />
      <rect x="3" y="4" width="1" height="1" fill="#6d4c41" />
      <rect x="4" y="4" width="3" height="1" fill="#fcd34d" />
      <rect x="7" y="4" width="1" height="1" fill="#000000" />
      <rect x="8" y="4" width="3" height="1" fill="#fcd34d" />

      <rect x="1" y="5" width="1" height="1" fill="#6d4c41" />
      <rect x="2" y="5" width="1" height="1" fill="#fcd34d" />
      <rect x="3" y="5" width="2" height="1" fill="#6d4c41" />
      <rect x="5" y="5" width="3" height="1" fill="#fcd34d" />
      <rect x="8" y="5" width="4" height="1" fill="#6d4c41" />

      {/* Face & Mustache */}
      <rect x="2" y="6" width="2" height="1" fill="#6d4c41" />
      <rect x="4" y="6" width="5" height="1" fill="#fcd34d" />
      <rect x="9" y="6" width="3" height="1" fill="#000000" />

      <rect x="3" y="7" width="7" height="1" fill="#fcd34d" />

      {/* Red Shirt */}
      <rect x="3" y="8" width="2" height="1" fill="#e11d48" />
      <rect x="5" y="8" width="1" height="1" fill="#2563eb" />
      <rect x="6" y="8" width="3" height="1" fill="#e11d48" />

      <rect x="2" y="9" width="3" height="1" fill="#e11d48" />
      <rect x="5" y="9" width="1" height="1" fill="#2563eb" />
      <rect x="6" y="9" width="2" height="1" fill="#e11d48" />
      <rect x="8" y="9" width="1" height="1" fill="#2563eb" />
      <rect x="9" y="9" width="2" height="1" fill="#e11d48" />

      {/* Overalls (Blue) */}
      <rect x="1" y="10" width="3" height="1" fill="#e11d48" />
      <rect x="4" y="10" width="4" height="1" fill="#2563eb" />
      <rect x="8" y="10" width="3" height="1" fill="#e11d48" />

      {/* Yellow Buttons & Hands */}
      <rect x="1" y="11" width="2" height="1" fill="#fcd34d" />
      <rect x="3" y="11" width="1" height="1" fill="#2563eb" />
      <rect x="4" y="11" width="1" height="1" fill="#fbbf24" />
      <rect x="5" y="11" width="2" height="1" fill="#2563eb" />
      <rect x="7" y="11" width="1" height="1" fill="#fbbf24" />
      <rect x="8" y="11" width="1" height="1" fill="#2563eb" />
      <rect x="9" y="11" width="2" height="1" fill="#fcd34d" />

      {/* Blue Pants */}
      <rect x="3" y="12" width="6" height="1" fill="#2563eb" />
      <rect x="2" y="13" width="3" height="1" fill="#2563eb" />
      <rect x="7" y="13" width="3" height="1" fill="#2563eb" />

      {/* Brown Shoes */}
      {isJumping ? (
        <>
          <rect x="1" y="14" width="3" height="1" fill="#6d4c41" />
          <rect x="8" y="14" width="3" height="1" fill="#6d4c41" />
          <rect x="1" y="15" width="4" height="1" fill="#6d4c41" />
          <rect x="8" y="15" width="4" height="1" fill="#6d4c41" />
        </>
      ) : (
        <>
          <rect x="1" y="14" width="3" height="1" fill="#6d4c41" />
          <rect x="8" y="14" width="3" height="1" fill="#6d4c41" />
          <rect x="1" y="15" width="4" height="1" fill="#6d4c41" />
          <rect x="8" y="15" width="4" height="1" fill="#6d4c41" />
        </>
      )}
    </svg>
  );
}
