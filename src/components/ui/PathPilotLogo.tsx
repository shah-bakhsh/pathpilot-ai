/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  inverted?: boolean;
}

export const PathPilotLogo: React.FC<LogoProps> = ({
  className,
  size = 40,
  inverted = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PathPilot AI Logo"
    >
      <defs>
        {/* Premium Gold Gradients */}
        <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE885" />
          <stop offset="40%" stopColor="#F5C518" />
          <stop offset="100%" stopColor="#B88A00" />
        </linearGradient>
        <linearGradient id="logoGoldShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5C518" />
          <stop offset="100%" stopColor="#7F5F00" />
        </linearGradient>
        
        {/* Silver Gradients */}
        <linearGradient id="logoSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E4E4E7" />
          <stop offset="100%" stopColor="#8F8F94" />
        </linearGradient>
        
        {/* Dark Charcoal Gradients */}
        <linearGradient id="logoDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3F3F46" />
          <stop offset="100%" stopColor="#0A0A0A" />
        </linearGradient>
      </defs>

      {/* Outer thin ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke={inverted ? "#FFFFFF" : "#0A0A0A"}
        strokeWidth="1.2"
        fill="none"
        opacity={inverted ? "0.9" : "0.85"}
      />

      {/* Inner thin ring */}
      <circle
        cx="50"
        cy="50"
        r="28"
        stroke={inverted ? "#FFFFFF" : "#0A0A0A"}
        strokeWidth="0.8"
        fill="none"
        opacity={inverted ? "0.6" : "0.5"}
      />

      {/* Concentric helper guide rings */}
      <circle
        cx="50"
        cy="50"
        r="18"
        stroke={inverted ? "#FFFFFF" : "#0A0A0A"}
        strokeWidth="0.5"
        fill="none"
        opacity={inverted ? "0.3" : "0.2"}
      />

      {/* Background Arc - Gold (Upper Left, approx 9 o'clock to 12 o'clock) */}
      <path
        d="M 22 50 A 28 28 0 0 1 50 22"
        stroke="url(#logoGoldGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Background Arc - Dark Charcoal (Bottom, approx 4 o'clock to 8 o'clock) */}
      <path
        d="M 70 68 A 28 28 0 0 1 30 68"
        stroke={inverted ? "#E4E4E7" : "url(#logoDarkGrad)"}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Background Arc - Silver (Right, approx 2 o'clock to 4 o'clock) */}
      <path
        d="M 78 50 A 28 28 0 0 1 70 68"
        stroke="url(#logoSilverGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      {/* Three-pronged star rotor (12, 7:30, 4:30) */}
      {/* 1. Top black prong pointing UP */}
      <path
        d="M 50 50 L 47 50 L 48 26 C 48 24 52 24 52 26 L 53 50 Z"
        fill={inverted ? "#D4D4D8" : "url(#logoDarkGrad)"}
      />
      {/* 2. Down-left prong */}
      <path
        d="M 50 50 L 48 48 L 33 58 C 31.5 59 33 62 34.5 61.5 L 52 52 Z"
        fill={inverted ? "#A1A1AA" : "url(#logoDarkGrad)"}
      />
      {/* 3. Down-right prong */}
      <path
        d="M 50 50 L 52 48 L 67 58 C 68.5 59 67 62 65.5 61.5 L 48 52 Z"
        fill={inverted ? "#A1A1AA" : "url(#logoDarkGrad)"}
      />

      {/* Pins/Circles at the tips of the 3 prongs */}
      {/* Top prong tip pin */}
      <circle cx="50" cy="24" r="2.5" fill="url(#logoSilverGrad)" stroke="#0A0A0A" strokeWidth="0.5" />
      <circle cx="50" cy="24" r="1.2" fill="#F5C518" />

      {/* Down-left tip pin */}
      <circle cx="33" cy="59" r="2.2" fill="url(#logoSilverGrad)" stroke="#0A0A0A" strokeWidth="0.5" />
      <circle cx="33" cy="59" r="0.8" fill="#FFFFFF" />

      {/* Down-right tip pin */}
      <circle cx="67" cy="59" r="2.2" fill="url(#logoSilverGrad)" stroke="#0A0A0A" strokeWidth="0.5" />
      <circle cx="67" cy="59" r="0.8" fill="#FFFFFF" />

      {/* Outstanding Gold Pointer pointing UP-RIGHT (approx 1:30) */}
      <g>
        {/* Left facet (lighter) */}
        <path
          d="M 50 50 L 47.5 45 L 61 28 Z"
          fill="url(#logoGoldGrad)"
        />
        {/* Right facet (shadow) */}
        <path
          d="M 50 50 L 61 28 L 54.5 39.5 Z"
          fill="url(#logoGoldShadowGrad)"
        />
      </g>

      {/* Sparkle star in the upper right (around 2 o'clock, x=61, y=24) */}
      <g transform="translate(61, 24)">
        <path
          d="M 0 -5.5 C 0 -1.5 1.5 0 5.5 0 C 1.5 0 0 1.5 0 5.5 C 0 1.5 -1.5 0 -5.5 0 C -1.5 0 0 -1.5 0 -5.5 Z"
          fill="#F5C518"
        />
      </g>

      {/* Center hub - Hexagon or circle with gold center */}
      <circle cx="50" cy="50" r="5" fill="url(#logoSilverGrad)" stroke="#3F3F46" strokeWidth="0.5" />
      {/* Inner hexagonal shape */}
      <polygon
        points="50,47.8 51.9,48.9 51.9,51.1 50,52.2 48.1,51.1 48.1,48.9"
        fill="#FFFFFF"
        stroke="#F5C518"
        strokeWidth="0.4"
      />
    </svg>
  );
};
