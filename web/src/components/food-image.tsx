import Image from 'next/image';

/** Local catalog assets also work without third-party image hosts. */
export function FoodImage({src,alt,small=false,hero=false,eager=false,quality=75}:{src:string;alt:string;small?:boolean;hero?:boolean;eager?:boolean;quality?:50|75}) {
 return <div className={`food-art${small?' small':''}${hero?' hero':''}`}><Image src={src} alt={alt} quality={quality} loading={eager||hero?'eager':'lazy'} fetchPriority={eager||hero?'high':'auto'} fill sizes={small?'72px':'(max-width: 430px) 100vw, 398px'} style={{objectFit:'cover'}} /></div>;
}
