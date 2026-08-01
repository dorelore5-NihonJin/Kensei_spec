interface StoreLogoProps {
  id: string;
  name?: string;
  size?: number;
}

export default function StoreLogo({ id, name = "" }: StoreLogoProps) {
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
  const logoPath = `/stores/${fileName}`;

  return (
    <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 p-1.5 transition-all group-hover:scale-105">
      <img
        src={logoPath}
        alt={name || id}
        className="w-full h-full object-contain rounded-xl"
        onError={(e) => {
          const target = e.target as HTMLElement;
          target.style.display = "none";
        }}
      />
    </div>
  );
}
