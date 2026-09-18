import React from 'react';
import { BRAND_LOGO_SRC } from '../assets/logoBase64';

export interface BrandLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  tagline?: boolean;
  lightMode?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 40,
  className = '',
  showText = false,
  tagline = false,
  lightMode = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <img
        src={BRAND_LOGO_SRC}
        alt="KnowTheMD Logo"
        width={size}
        height={size}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="shrink-0 object-contain rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-transform duration-300 hover:scale-105"
      />

      {showText && (
        <div className="flex flex-col justify-center text-left">
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tight font-sans text-white">
              KnowThe<span className="text-cyan-400 bg-gradient-to-r from-cyan-400 to-sky-500 bg-clip-text text-transparent">MD</span>
            </span>
          </div>
          {tagline && (
            <span className="text-xs tracking-wider uppercase font-medium text-slate-400">
              Read. Write. Understand Markdown.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
