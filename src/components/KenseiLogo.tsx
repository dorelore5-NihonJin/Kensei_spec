interface KenseiLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function KenseiLogo({ size = 40, className = "", showText = false }: KenseiLogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 
        ULTRA-CLEAN MINIMALIST CORPORATE BRAND MARK (Google / Vercel / Tesla aesthetic)
        - Zero clutter, zero 3D, zero gradients, zero complex objects
        - Crisp geometric "K" icon inside a dark obsidian pill container
      */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        {/* Rounded Container */}
        <rect width="100" height="100" rx="28" fill="#1E2022" />

        {/* Minimalist Solid Rose Accent Bar (Spine) */}
        <rect x="28" y="24" width="10" height="52" rx="5" fill="#E88D9F" />

        {/* Top Blade Stroke */}
        <path
          d="M38 50 L68 24"
          stroke="#E88D9F"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Bottom Hardware Stroke */}
        <path
          d="M38 50 L68 76"
          stroke="#8A9A86"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg tracking-tight text-[#1E2022] dark:text-white leading-none">
              KENSEI SPEC
            </span>
            <span className="text-[9px] font-black uppercase bg-[#E88D9F] text-white px-2 py-0.5 rounded-full tracking-wider">
              剣聖
            </span>
          </div>
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase mt-1">
            Hardware Physics & Telemetry
          </span>
        </div>
      )}
    </div>
  );
}
