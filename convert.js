import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

fs.readdirSync('public').forEach(file => {
  if (/\.(png|jpe?g|jpg)$/i.test(file)) {
    const fullIn = path.join('public', file);
    const name = path.parse(file).name;
    sharp(fullIn).webp().toFile(path.join('public', `${name}.webp`))
      .catch(e => console.error(e));
  }
});