import fs from 'fs';
import path from 'path';
import https from 'https';

const storesDir = path.resolve('public/stores');
if (!fs.existsSync(storesDir)) {
  fs.mkdirSync(storesDir, { recursive: true });
}

const logos = [
  { file: 'ozon.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Ozon_logo.svg' },
  { file: 'yandex.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Yandex_Market_logo_2024.svg' },
  { file: 'wildberries.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Wildberries_Logo.svg' },
  { file: 'aliexpress.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/AliExpress_logo.svg' },
  { file: 'amazon.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { file: 'rakuten.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Rakuten_Global_Brand_Logo.svg' },
  { file: 'bestbuy.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg' },
  { file: 'newegg.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Newegg_logo.svg' },
  { file: 'ebay.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg' },
  { file: 'biccamera.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Bic_Camera_logo.svg' },
  { file: 'microcenter.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Micro_Center_logo.svg' },
  { file: 'bhphoto.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/B%26H_Photo_Video_logo.svg' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    });
    request.on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  console.log('Downloading official store logos...');
  for (const item of logos) {
    const dest = path.join(storesDir, item.file);
    try {
      await download(item.url, dest);
      console.log(`✓ Downloaded ${item.file}`);
    } catch (err) {
      console.error(`✗ Error downloading ${item.file}:`, err.message);
    }
  }
  console.log('Done downloading logos!');
}

main();
