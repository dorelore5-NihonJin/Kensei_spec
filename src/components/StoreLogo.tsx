interface StoreLogoProps {
  id: string;
  name: string;
  size?: number;
}

export default function StoreLogo({ id, size = 36 }: StoreLogoProps) {
  switch (id) {
    case "ozon":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="36" height="36" rx="10" fill="#005BFF" />
          <path d="M7 18C7 11.9249 11.9249 7 18 7C24.0751 7 29 11.9249 29 18C29 24.0751 24.0751 29 18 29C11.9249 29 7 24.0751 7 18Z" fill="#005BFF" stroke="white" strokeWidth="3" />
          <path d="M12 18C12 14.6863 14.6863 12 18 12C21.3137 12 24 14.6863 24 18C24 21.3137 21.3137 24 18 24C14.6863 24 12 21.3137 12 18Z" fill="white" />
          <circle cx="18" cy="18" r="3" fill="#005BFF" />
        </svg>
      );

    case "yandex":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="36" height="36" rx="10" fill="#FFCC00" />
          <path d="M22.5 10H17.2C13.8 10 11.5 12.1 11.5 15.2C11.5 17.8 13.1 19.3 15.5 20.3L11 26H14.5L18.6 20.7H19.8V26H22.5V10ZM19.8 18.2H17C15.3 18.2 14.2 17.2 14.2 15.5C14.2 13.8 15.4 12.5 17.3 12.5H19.8V18.2Z" fill="#000000" />
        </svg>
      );

    case "dns":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="36" height="36" rx="10" fill="#FF6600" />
          <text x="18" y="23" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="13" fill="white" textAnchor="middle" letterSpacing="-0.5">DNS</text>
        </svg>
      );

    case "wildberries":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <defs>
            <linearGradient id="wb-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#CB11AB" />
              <stop offset="1" stopColor="#481173" />
            </linearGradient>
          </defs>
          <rect width="36" height="36" rx="10" fill="url(#wb-grad)" />
          <text x="18" y="23" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="14" fill="white" textAnchor="middle" letterSpacing="-0.5">WB</text>
        </svg>
      );

    case "aliexpress":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="36" height="36" rx="10" fill="#FF4747" />
          <path d="M12 25L18 10L24 25H20.5L19.2 21.5H16.8L15.5 25H12ZM17.4 17.8H18.6L18 16.1L17.4 17.8Z" fill="white" />
          <path d="M24 10C24 10 26 12 26 14C26 16 24 17 24 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "amazon-global":
    case "amazon-jp":
    case "amazon-us":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="36" height="36" rx="10" fill="#131921" />
          <path d="M10 22C14 24.5 21 24.5 25 21" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M23 19.5L26 21L24 23.5" fill="#FF9900" />
          <text x="18" y="17" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="11" fill="white" textAnchor="middle">a</text>
        </svg>
      );

    case "rakuten":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="36" height="36" rx="10" fill="#BF0000" />
          <path d="M13 10H19C21.2 10 22.5 11.2 22.5 13C22.5 14.5 21.5 15.5 20 15.9L23 24H20L17.3 16.5H15.5V24H13V10ZM15.5 12V14.5H18.5C19.5 14.5 20.2 14 20.2 13.2C20.2 12.4 19.5 12 18.5 12H15.5Z" fill="white" />
          <circle cx="24" cy="24" r="2" fill="#FFCC00" />
        </svg>
      );

    case "yahoo-jp":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="36" height="36" rx="10" fill="#FF0033" />
          <path d="M11 11L16.5 18V25H19.5V18L25 11H21.5L18 16L14.5 11H11Z" fill="white" />
          <rect x="23" y="22" width="3" height="3" rx="0.5" fill="white" />
        </svg>
      );

    case "dospara":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="36" height="36" rx="10" fill="#0066CC" />
          <text x="18" y="23" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="13" fill="white" textAnchor="middle">Dos</text>
        </svg>
      );

    case "biccamera":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="36" height="36" rx="10" fill="#E60012" />
          <circle cx="18" cy="18" r="9" fill="white" />
          <text x="18" y="22" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="11" fill="#E60012" textAnchor="middle">Bic</text>
        </svg>
      );

    case "newegg":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="36" height="36" rx="10" fill="#1A2B4C" />
          <ellipse cx="18" cy="18" rx="8" ry="11" fill="#F58220" />
          <ellipse cx="18" cy="18" rx="5" ry="7" fill="#FFCC00" />
        </svg>
      );

    case "bestbuy":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="36" height="36" rx="10" fill="#0046BE" />
          <path d="M22 10L27 15V26H22V10Z" fill="#FFF000" />
          <text x="14" y="23" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="11" fill="white" textAnchor="middle">BEST</text>
        </svg>
      );

    case "microcenter":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="36" height="36" rx="10" fill="#E2001A" />
          <path d="M10 11H14L18 19L22 11H26V25H22.5V16L19 23H17L13.5 16V25H10V11Z" fill="white" />
        </svg>
      );

    case "bhphoto":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="36" height="36" rx="10" fill="#0066B3" />
          <text x="18" y="23" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="13" fill="white" textAnchor="middle">B&H</text>
        </svg>
      );

    case "ebay":
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-xl shadow-xs shrink-0">
          <rect width="36" height="36" rx="10" fill="#F7F7F7" stroke="#E5E5E5" />
          <text x="9" y="23" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="12" fill="#E53238">e</text>
          <text x="15" y="23" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="12" fill="#0064D2">b</text>
          <text x="21" y="23" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="12" fill="#F5AF02">a</text>
          <text x="27" y="23" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="12" fill="#86B817">y</text>
        </svg>
      );

    default:
      return (
        <div
          className="rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-xs"
          style={{ width: size, height: size, backgroundColor: "#555" }}
        >
          {name.substring(0, 2).toUpperCase()}
        </div>
      );
  }
}
