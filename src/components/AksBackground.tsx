import React from 'react';

export const AksBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#fbfbfa]">
      {/* Base silky off-white cream gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff] via-[#f7f6f4] to-[#edece8]" />

      {/* SVG flowing curves and rose gold ribbons matching user's screenshot */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        viewBox="0 0 1000 1600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Rose gold / champagne metallic gradient */}
          <linearGradient id="roseGoldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d89f68" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#f7d4b2" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#e5b07c" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#b87a46" stopOpacity="0.85" />
          </linearGradient>

          {/* Soft silk fold shadow gradient */}
          <linearGradient id="silkShadow1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#f0ede8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e2ded7" stopOpacity="0.65" />
          </linearGradient>

          <linearGradient id="silkShadow2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f5f3ef" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ded9d1" stopOpacity="0.6" />
          </linearGradient>

          {/* Blur filter for smooth satin lighting */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Top-left to bottom-right silky fabric curve 1 */}
        <path
          d="M -100,200 C 250,150 650,500 1100,750 L 1100,0 L -100,0 Z"
          fill="url(#silkShadow1)"
          opacity="0.8"
        />

        {/* Diagonal Rose Gold metallic ribbon 1 (matching the screenshot) */}
        <path
          d="M -50,580 C 200,430 550,220 1050,40"
          stroke="url(#roseGoldRibbon)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Subtle ribbon drop shadow */}
        <path
          d="M -50,583 C 200,433 550,223 1050,43"
          stroke="rgba(180, 140, 110, 0.25)"
          strokeWidth="7"
          fill="none"
          filter="url(#softGlow)"
        />

        {/* Middle soft silky wave */}
        <path
          d="M -50,750 C 350,900 700,1200 1100,1100 L 1100,1650 L -50,1650 Z"
          fill="url(#silkShadow2)"
          opacity="0.5"
        />

        {/* Lower Rose Gold metallic ribbon (matching bottom swoosh in screenshot) */}
        <path
          d="M -50,1400 C 400,1350 750,1260 1050,1180"
          stroke="url(#roseGoldRibbon)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M -50,1404 C 400,1354 750,1264 1050,1184"
          stroke="rgba(180, 140, 110, 0.2)"
          strokeWidth="6"
          fill="none"
          filter="url(#softGlow)"
        />
      </svg>

      {/* Subtle pearlescent lighting vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/40" />
    </div>
  );
};
