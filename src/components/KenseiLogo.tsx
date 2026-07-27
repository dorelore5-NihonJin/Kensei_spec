interface KenseiLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function KenseiLogo({ size = 44, className = "", showText = false }: KenseiLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Sleek Professional Corporate Geometric Icon (Google/Vercel/Sony aesthetic) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Main Silicon Rose Gradient */}
          <linearGradient id="kenseiRoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E88D9F" />
            <stop offset="100%" stopColor="#C45A72" />
          </linearGradient>

          {/* Sage Hardware Accent Gradient */}
          <linearGradient id="kenseiSageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A9A86" />
            <stop offset="100%" stopColor="#556B52" />
          </linearGradient>

          {/* Metallic Silver Gradient */}
          <linearGradient id="kenseiSilverGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2A2D32" />
            <stop offset="50%" stopColor="#4A4E57" />
            <stop offset="100%" stopColor="#1E2022" />
          </linearGradient>

          {/* Core Glow Filter */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#E88D9F" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 1. Outer Dark Hexagonal Silicon Die Frame */}
        <path
          d="M50 6 L88 28 V72 L50 94 L12 72 V28 Z"
          fill="url(#kenseiSilverGrad)"
          stroke="url(#kenseiRoseGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* 2. Inner Circuit Micro-Grid Corner Accents */}
        <circle cx="50" cy="18" r="2.5" fill="#E88D9F" />
        <circle cx="78" cy="34" r="2" fill="#8A9A86" />
        <circle cx="78" cy="66" r="2" fill="#8A9A86" />
        <circle cx="50" cy="82" r="2.5" fill="#E88D9F" />
        <circle cx="22" cy="66" r="2" fill="#8A9A86" />
        <circle cx="22" cy="34" r="2" fill="#8A9A86" />

        {/* 3. Stylized Minimalist Katana Edge "K" Geometry */}
        {/* Vertical Spine (Blade Edge) */}
        <path
          d="M40 26 L40 74"
          stroke="url(#kenseiRoseGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#logoGlow)"
        />

        {/* Upper Slash Edge */}
        <path
          d="M40 50 L68 26"
          stroke="url(#kenseiRoseGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#logoGlow)"
        />

        {/* Lower Slash Edge */}
        <path
          d="M40 50 L68 74"
          stroke="url(#kenseiSageGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Center Diamond Core Jewel */}
        <polygon
          points="50,44 56,50 50,56 44,50"
          fill="#FFFFFF"
          stroke="#E88D9F"
          strokeWidth="1.5"
        />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-black text-base sm:text-lg tracking-wider text-[#1E2022] dark:text-white flex items-center gap-2 leading-none">
            KENSEI SPEC
            <span className="text-[9px] font-black uppercase bg-[#E88D9F] text-white px-2 py-0.5 rounded-full tracking-widest shadow-xs">
              剣聖
            </span>
          </span>
          <span className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 tracking-widest uppercase mt-1">
            Hardware Physics & Telemetry
          </span>
        </div>
      )}
    </div>
  );
}
