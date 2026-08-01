import { useState } from "react";

interface StoreLogoProps {
  id: string;
  name?: string;
  size?: number;
}

export default function StoreLogo({ id, name = "" }: StoreLogoProps) {
  const [imgError, setImgError] = useState(false);

  const fileNameMap: Record<string, string> = {
    ozon: "ozon.png",
    yandex: "yandex.png",
    dns: "dns.png",
    wildberries: "wildberries.png",
    "ali-ru": "aliexpress.png",
    aliexpress: "aliexpress.png",
    "amazon-global": "amazon.png",
    "amazon-jp": "amazon.png",
    "amazon-us": "amazon.png",
    amazon: "amazon.png",
    rakuten: "rakuten.png",
    "yahoo-jp": "yahoo.png",
    yahoo: "yahoo.png",
    dospara: "dospara.png",
    biccamera: "biccamera.png",
    newegg: "newegg.png",
    bestbuy: "bestbuy.png",
    microcenter: "microcenter.png",
    bhphoto: "bhphoto.png",
    ebay: "ebay.png"
  };

  const fileName = fileNameMap[id] || `${id}.png`;
  const baseUrl = import.meta.env.BASE_URL || "./";
  const cleanBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const logoPath = `${cleanBase}stores/${fileName}`;

  const brandColors: Record<string, { bg: string; text: string }> = {
    ozon: { bg: "#005BFF", text: "OZON" },
    yandex: { bg: "#FFCC00", text: "ЯМ" },
    dns: { bg: "#FF6600", text: "DNS" },
    wildberries: { bg: "#CB11AB", text: "WB" },
    aliexpress: { bg: "#FF4747", text: "ALI" },
    "ali-ru": { bg: "#FF4747", text: "ALI" },
    amazon: { bg: "#131921", text: "AMZ" },
    "amazon-global": { bg: "#131921", text: "AMZ" },
    "amazon-jp": { bg: "#131921", text: "AMZ" },
    "amazon-us": { bg: "#131921", text: "AMZ" },
    rakuten: { bg: "#BF0000", text: "RAK" },
    yahoo: { bg: "#FF0033", text: "Y!" },
    "yahoo-jp": { bg: "#FF0033", text: "Y!" },
    dospara: { bg: "#0066CC", text: "DOS" },
    biccamera: { bg: "#E60012", text: "BIC" },
    newegg: { bg: "#0A1833", text: "EGG" },
    bestbuy: { bg: "#0046BE", text: "BBY" },
    microcenter: { bg: "#E2001A", text: "MC" },
    bhphoto: { bg: "#0066B3", text: "B&H" },
    ebay: { bg: "#E53238", text: "EBAY" }
  };

  const brand = brandColors[id] || { bg: "#0066CC", text: (name || id).substring(0, 3).toUpperCase() };

  if (imgError) {
    return (
      <div
        className="w-10 h-10 rounded-2xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center font-black text-xs text-white p-1 transition-all group-hover:scale-105"
        style={{ backgroundColor: brand.bg, color: brand.bg === "#FFCC00" ? "#000000" : "#FFFFFF" }}
      >
        {brand.text}
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 p-1 transition-all group-hover:scale-105">
      <img
        src={logoPath}
        alt={name || id}
        className="w-full h-full object-contain rounded-xl"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
