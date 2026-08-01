interface StoreLogoProps {
  id: string;
  name?: string;
  size?: number;
}

export default function StoreLogo({ id, name = "", size = 36 }: StoreLogoProps) {
  const fileNameMap: Record<string, string> = {
    ozon: "ozon.svg",
    yandex: "yandex.svg",
    dns: "dns.svg",
    wildberries: "wildberries.svg",
    "ali-ru": "aliexpress.svg",
    aliexpress: "aliexpress.svg",
    "amazon-global": "amazon.svg",
    "amazon-jp": "amazon.svg",
    "amazon-us": "amazon.svg",
    amazon: "amazon.svg",
    rakuten: "rakuten.svg",
    "yahoo-jp": "yahoo.svg",
    yahoo: "yahoo.svg",
    dospara: "dospara.svg",
    biccamera: "biccamera.svg",
    newegg: "newegg.svg",
    bestbuy: "bestbuy.svg",
    microcenter: "microcenter.svg",
    bhphoto: "bhphoto.svg",
    ebay: "ebay.svg"
  };

  const fileName = fileNameMap[id] || `${id}.svg`;
  const logoPath = `/stores/${fileName}`;

  return (
    <div
      className="rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
      style={{ width: size * 1.7, height: size }}
    >
      <img
        src={logoPath}
        alt={name || id}
        className="w-full h-full object-contain p-0.5"
        onError={(e) => {
          (e.target as HTMLElement).style.display = "none";
        }}
      />
    </div>
  );
}
