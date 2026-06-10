// convert-to-webp.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

fs.readdirSync('public').forEach(file => {
  if (/\.(png|jpe?g|jpg)$/i.test(file)) {
    const fullIn = path.join('public', file);
    const name = path.parse(file).name;
    sharp(fullIn).webp().toFile(path.join('public', `${name}.webp`))
      .catch(e => console.error(e));
  }
});