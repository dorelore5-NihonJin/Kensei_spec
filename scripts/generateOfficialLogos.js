import fs from 'fs';
import path from 'path';

const storesDir = path.resolve('public/stores');
if (!fs.existsSync(storesDir)) {
  fs.mkdirSync(storesDir, { recursive: true });
}

const svgMap = {
  'ozon.svg': `<svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="40" rx="8" fill="#005BFF"/>
  <path d="M22 20C22 14.4772 26.4772 10 32 10C37.5228 10 42 14.4772 42 20C42 25.5228 37.5228 30 32 30C26.4772 30 22 25.5228 22 20Z" stroke="white" stroke-width="4.5"/>
  <path d="M46 12.5H62L46 27.5H62" stroke="white" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M68 20C68 14.4772 72.4772 10 78 10C83.5228 10 88 14.4772 88 20C88 25.5228 83.5228 30 78 30C72.4772 30 68 25.5228 68 20Z" stroke="white" stroke-width="4.5"/>
  <path d="M92 29.5V10.5H99.5C104 10.5 107 13 107 16.5C107 20 104 22.5 99.5 22.5H92" stroke="white" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  'yandex.svg': `<svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="140" height="40" rx="8" fill="#FFCC00"/>
  <path d="M26 11H18C13.5 11 10 14.5 10 19C10 23 12.5 25.5 16 27L9 36H15L21.5 27.5H23.5V36H28.5V11H26ZM23.5 23H18.5C15.5 23 14 21.5 14 19C14 16.5 16 15 18.5 15H23.5V23Z" fill="#000000"/>
  <text x="36" y="27" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" fill="#000000" letter-spacing="-0.5">Маркет</text>
</svg>`,

  'dns.svg': `<svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="40" rx="8" fill="#FF6600"/>
  <text x="60" y="27" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">DNS</text>
</svg>`,

  'wildberries.svg': `<svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wb-bg" x1="0" y1="0" x2="140" y2="40" gradientUnits="userSpaceOnUse">
      <stop stop-color="#CB11AB"/>
      <stop offset="1" stop-color="#481173"/>
    </linearGradient>
  </defs>
  <rect width="140" height="40" rx="8" fill="url(#wb-bg)"/>
  <text x="70" y="26" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="14" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">WILDBERRIES</text>
</svg>`,

  'aliexpress.svg': `<svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="140" height="40" rx="8" fill="#FF4747"/>
  <text x="70" y="26" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.3">AliExpress</text>
</svg>`,

  'amazon.svg': `<svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="40" rx="8" fill="#131921"/>
  <text x="56" y="24" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="17" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">amazon</text>
  <path d="M32 29C48 34 76 34 88 27" stroke="#FF9900" stroke-width="3" stroke-linecap="round"/>
  <path d="M84 25L92 27.5L86 31" fill="#FF9900"/>
</svg>`,

  'rakuten.svg': `<svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="40" rx="8" fill="#BF0000"/>
  <text x="56" y="26" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="17" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">Rakuten</text>
  <circle cx="98" cy="26" r="3" fill="#FFCC00"/>
</svg>`,

  'yahoo.svg': `<svg width="130" height="40" viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="130" height="40" rx="8" fill="#FF0033"/>
  <text x="65" y="26" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">Yahoo! JAPAN</text>
</svg>`,

  'dospara.svg': `<svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="40" rx="8" fill="#0066CC"/>
  <text x="60" y="26" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="17" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">Dospara</text>
</svg>`,

  'biccamera.svg': `<svg width="130" height="40" viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="130" height="40" rx="8" fill="#E60012"/>
  <text x="65" y="26" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">BicCamera</text>
</svg>`,

  'newegg.svg': `<svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="40" rx="8" fill="#0A1833"/>
  <ellipse cx="28" cy="20" rx="10" ry="14" fill="#F58220"/>
  <ellipse cx="28" cy="20" rx="6" ry="9" fill="#FFCC00"/>
  <text x="74" y="26" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.3">newegg</text>
</svg>`,

  'bestbuy.svg': `<svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="40" rx="8" fill="#0046BE"/>
  <text x="50" y="25" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">BEST BUY</text>
  <path d="M92 10L106 17V30H92V10Z" fill="#FFF000"/>
</svg>`,

  'microcenter.svg': `<svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="140" height="40" rx="8" fill="#E2001A"/>
  <text x="70" y="26" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="14" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.3">MICRO CENTER</text>
</svg>`,

  'bhphoto.svg': `<svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="40" rx="8" fill="#0066B3"/>
  <text x="60" y="26" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="18" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">B&amp;H</text>
</svg>`,

  'ebay.svg': `<svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="40" rx="8" fill="#FFFFFF" stroke="#E5E5E5"/>
  <text x="25" y="27" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24" fill="#E53238">e</text>
  <text x="43" y="27" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24" fill="#0064D2">b</text>
  <text x="63" y="27" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24" fill="#F5AF02">a</text>
  <text x="81" y="27" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24" fill="#86B817">y</text>
</svg>`
};

for (const [filename, content] of Object.entries(svgMap)) {
  fs.writeFileSync(path.join(storesDir, filename), content, 'utf8');
}
console.log('Successfully generated all 15 official store SVGs in public/stores/');
