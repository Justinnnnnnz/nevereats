/** Card crops avoid downloading the full-height hero on the browsing page. */
export function restaurantCardImage(src:string){return src.replace(/\.webp$/,'-card.webp');}
