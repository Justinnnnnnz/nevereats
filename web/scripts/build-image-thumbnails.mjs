import sharp from 'sharp';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const catalog=JSON.parse(await readFile(new URL('../../api/seed/restaurants.json',import.meta.url),'utf8'));
for(const restaurant of catalog){
 const source=new URL(`../public${restaurant.image_url}`,import.meta.url);
 const target=new URL(`../public${restaurant.image_url.replace(/\.webp$/,'-card.webp')}`,import.meta.url);
 // Match the 398×130 card crop; retain the full photograph for the restaurant hero.
 await sharp(fileURLToPath(source)).resize(600,195,{fit:'cover'}).webp({quality:55}).toFile(fileURLToPath(target));
}
console.log(`Built ${catalog.length} restaurant card crops`);
