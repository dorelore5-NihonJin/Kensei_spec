interface StoreLogoProps {
  id: string;
  name?: string;
  size?: number;
}

export default function StoreLogo({ id, name = "", size = 36 }: StoreLogoProps) {
  const width = Math.round(size * 2.6);
  const height = size;

  switch (id) {
    case "ozon":
      return (
        <svg width={width} height={height} viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="110" height="36" rx="8" fill="#005BFF" />
          {/* O */}
          <circle cx="20" cy="18" r="7" stroke="white" strokeWidth="3" />
          {/* Z */}
          <path d="M34 11H46L34 25H46" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          {/* O */}
          <circle cx="60" cy="18" r="7" stroke="white" strokeWidth="3" />
          {/* N */}
          <path d="M72 25V11L84 25V11" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "yandex":
      return (
        <svg width={width} height={height} viewBox="0 0 130 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="130" height="36" rx="8" fill="#FFCC00" />
          {/* Ya Logo Mark */}
          <path d="M22 9H15.5C12 9 9.5 11.8 9.5 15.2C9.5 18.5 11.5 20.5 14.2 21.8L8.5 29H13.8L19 21.8H20.5V29H24.5V9H22ZM20.5 18H16C13.8 18 12.8 16.8 12.8 15.2C12.8 13.5 14.2 12.2 16.2 12.2H20.5V18Z" fill="#000000" />
          {/* Маркет text */}
          <text x="32" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="14" fill="#000000" letterSpacing="-0.3">Маркет</text>
        </svg>
      );

    case "dns":
      return (
        <svg width={width} height={height} viewBox="0 0 100 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="100" height="36" rx="8" fill="#FF6600" />
          <text x="50" y="25" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="20" fill="#FFFFFF" textAnchor="middle" letterSpacing="1">DNS</text>
        </svg>
      );

    case "wildberries":
    case "wb":
      return (
        <svg width={width} height={height} viewBox="0 0 130 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <defs>
            <linearGradient id="wb-grad-main" x1="0" y1="0" x2="130" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#CB11AB" />
              <stop offset="1" stopColor="#481173" />
            </linearGradient>
          </defs>
          <rect width="130" height="36" rx="8" fill="url(#wb-grad-main)" />
          <text x="65" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="12" fill="#FFFFFF" textAnchor="middle" letterSpacing="0.8">WILDBERRIES</text>
        </svg>
      );

    case "ali-ru":
    case "aliexpress":
      return (
        <svg width={width} height={height} viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="120" height="36" rx="8" fill="#FF4747" />
          <text x="60" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="15" fill="#FFFFFF" textAnchor="middle" letterSpacing="-0.3">AliExpress</text>
        </svg>
      );

    case "amazon-global":
    case "amazon-jp":
    case "amazon-us":
    case "amazon":
      return (
        <svg width={width} height={height} viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="110" height="36" rx="8" fill="#131921" />
          <text x="52" y="22" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="15" fill="#FFFFFF" textAnchor="middle" letterSpacing="-0.5">amazon</text>
          <path d="M28 26C44 31 70 31 80 25" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M77 23.5L84 25.5L79 28.5" fill="#FF9900" />
        </svg>
      );

    case "rakuten":
      return (
        <svg width={width} height={height} viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="110" height="36" rx="8" fill="#BF0000" />
          <text x="50" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="16" fill="#FFFFFF" textAnchor="middle" letterSpacing="0.5">Rakuten</text>
          <circle cx="88" cy="24" r="3" fill="#FFCC00" />
        </svg>
      );

    case "yahoo-jp":
    case "yahoo":
      return (
        <svg width={width} height={height} viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="120" height="36" rx="8" fill="#FF0033" />
          <text x="60" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF" textAnchor="middle" letterSpacing="-0.3">Yahoo! JAPAN</text>
        </svg>
      );

    case "dospara":
      return (
        <svg width={width} height={height} viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="110" height="36" rx="8" fill="#0066CC" />
          <text x="55" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="16" fill="#FFFFFF" textAnchor="middle" letterSpacing="0.5">Dospara</text>
        </svg>
      );

    case "biccamera":
      return (
        <svg width={width} height={height} viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="120" height="36" rx="8" fill="#E60012" />
          <text x="60" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF" textAnchor="middle" letterSpacing="0.3">BicCamera</text>
        </svg>
      );

    case "newegg":
      return (
        <svg width={width} height={height} viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="110" height="36" rx="8" fill="#0A1833" />
          <ellipse cx="24" cy="18" rx="8" ry="12" fill="#F58220" />
          <ellipse cx="24" cy="18" rx="5" ry="8" fill="#FFCC00" />
          <text x="68" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="15" fill="#FFFFFF" textAnchor="middle" letterSpacing="-0.3">newegg</text>
        </svg>
      );

    case "bestbuy":
      return (
        <svg width={width} height={height} viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="110" height="36" rx="8" fill="#0046BE" />
          <text x="46" y="23" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF" textAnchor="middle" letterSpacing="-0.5">BEST BUY</text>
          <path d="M84 9L97 15V27H84V9Z" fill="#FFF000" />
        </svg>
      );

    case "microcenter":
      return (
        <svg width={width} height={height} viewBox="0 0 130 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="130" height="36" rx="8" fill="#E2001A" />
          <text x="65" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" text-anchor="middle" letterSpacing="-0.3">MICRO CENTER</text>
        </svg>
      );

    case "bhphoto":
      return (
        <svg width={width} height={height} viewBox="0 0 100 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="100" height="36" rx="8" fill="#0066B3" />
          <text x="50" y="25" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="18" fill="#FFFFFF" textAnchor="middle" letterSpacing="-0.5">B&amp;H</text>
        </svg>
      );

    case "ebay":
      return (
        <svg width={width} height={height} viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="110" height="36" rx="8" fill="#FFFFFF" stroke="#E5E5E5" />
          <text x="22" y="25" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="22" fill="#E53238">e</text>
          <text x="38" y="25" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="22" fill="#0064D2">b</text>
          <text x="56" y="25" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="22" fill="#F5AF02">a</text>
          <text x="73" y="25" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="22" fill="#86B817">y</text>
        </svg>
      );

    default: {
      const displayText = name ? name.substring(0, 4).toUpperCase() : "SHOP";
      return (
        <div
          className="rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-xs px-2"
          style={{ width, height, backgroundColor: "#0066CC" }}
        >
          {displayText}
        </div>
      );
    }
  }
}
