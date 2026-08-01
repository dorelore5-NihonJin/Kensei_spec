import fs from 'fs';
import path from 'path';
import https from 'https';

const storesDir = path.resolve('public/stores');
if (!fs.existsSync(storesDir)) {
  fs.mkdirSync(storesDir, { recursive: true });
}

const domains = [
  { id: 'ozon', domain: 'ozon.ru' },
  { id: 'yandex', domain: 'market.yandex.ru' },
  { id: 'dns', domain: 'dns-shop.ru' },
  { id: 'wildberries', domain: 'wildberries.ru' },
  { id: 'aliexpress', domain: 'aliexpress.ru' },
  { id: 'amazon', domain: 'amazon.com' },
  { id: 'rakuten', domain: 'rakuten.co.jp' },
  { id: 'yahoo', domain: 'shopping.yahoo.co.jp' },
  { id: 'dospara', domain: 'dospara.co.jp' },
  { id: 'biccamera', domain: 'biccamera.com' },
  { id: 'newegg', domain: 'newegg.com' },
  { id: 'bestbuy', domain: 'bestbuy.com' },
  { id: 'microcenter', domain: 'microcenter.com' },
  { id: 'bhphoto', domain: 'bhphotovideo.com' },
  { id: 'ebay', domain: 'ebay.com' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const req = https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    });
    req.on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  console.log('Fetching Google 128px HD brand favicons...');
  for (const item of domains) {
    const url = `https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`;
    const dest = path.join(storesDir, `${item.id}.png`);
    try {
      await download(url, dest);
      console.log(`✓ Fetched ${item.id}.png from ${item.domain}`);
    } catch (err) {
      console.error(`✗ Error ${item.id}:`, err.message);
    }
  }
  console.log('Favicon fetching completed!');
}

main();
