import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function DreamyIcon({ className = 'w-5 h-5', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Sleek Minimalist Luxury AI Nexus Core (100% 4-Way Perfectly Symmetric) */}
      <path
        d="M12 2.5C12 7.74671 7.74671 12 2.5 12C7.74671 12 12 16.2533 12 21.5C12 16.2533 16.2533 12 21.5 12C16.2533 12 12 7.74671 12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Absolute Dead Center Micro Photon Glint */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default DreamyIcon;
