import fs from 'fs';
import path from 'path';
import https from 'https';

const storesDir = path.resolve('public/stores');
if (!fs.existsSync(storesDir)) {
  fs.mkdirSync(storesDir, { recursive: true });
}

// Clearbit logo API provides high-resolution 128x128 official PNG brand icons!
const logoSources = [
  { id: 'ozon', url: 'https://logo.clearbit.com/ozon.ru' },
  { id: 'yandex', url: 'https://logo.clearbit.com/market.yandex.ru' },
  { id: 'dns', url: 'https://logo.clearbit.com/dns-shop.ru' },
  { id: 'wildberries', url: 'https://logo.clearbit.com/wildberries.ru' },
  { id: 'aliexpress', url: 'https://logo.clearbit.com/aliexpress.com' },
  { id: 'amazon', url: 'https://logo.clearbit.com/amazon.com' },
  { id: 'rakuten', url: 'https://logo.clearbit.com/rakuten.co.jp' },
  { id: 'yahoo', url: 'https://logo.clearbit.com/shopping.yahoo.co.jp' },
  { id: 'dospara', url: 'https://logo.clearbit.com/dospara.co.jp' },
  { id: 'biccamera', url: 'https://logo.clearbit.com/biccamera.com' },
  { id: 'newegg', url: 'https://logo.clearbit.com/newegg.com' },
  { id: 'bestbuy', url: 'https://logo.clearbit.com/bestbuy.com' },
  { id: 'microcenter', url: 'https://logo.clearbit.com/microcenter.com' },
  { id: 'bhphoto', url: 'https://logo.clearbit.com/bhphotovideo.com' },
  { id: 'ebay', url: 'https://logo.clearbit.com/ebay.com' }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    });
    req.on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  console.log('Downloading real brand PNG logos...');
  for (const item of logoSources) {
    const dest = path.join(storesDir, `${item.id}.png`);
    try {
      await downloadFile(item.url, dest);
      console.log(`✓ Saved ${item.id}.png`);
    } catch (err) {
      console.error(`✗ Failed ${item.id}.png:`, err.message);
    }
  }
  console.log('Finished downloading real PNG brand logos!');
}

main();
