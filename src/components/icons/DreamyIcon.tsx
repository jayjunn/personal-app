import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function DreamyIcon({ className = 'w-5 h-5', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Dreamy Celestial Astroid Star (몽환적인 4각 다이아몬드 별) */}
      <path
        d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z"
        fill="currentColor"
      />
      {/* Central Ethereal Core Glint */}
      <circle cx="12" cy="12" r="2" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

export default DreamyIcon;
