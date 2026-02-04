const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'db', 'migrations');
const dest = path.join(__dirname, '..', 'dist', 'db', 'migrations');

if (!fs.existsSync(src)) {
  console.warn(`[migrations] source not found: ${src}`);
  process.exit(0);
}

fs.mkdirSync(dest, { recursive: true });
fs.cpSync(src, dest, { recursive: true });
console.log(`[migrations] copied ${src} -> ${dest}`);
