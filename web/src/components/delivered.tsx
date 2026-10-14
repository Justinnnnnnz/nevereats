"use client";
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {motion,useReducedMotion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/api';
import {money} from '@/lib/store';
import {orderDate,yuan} from '@/lib/savings';
import type {Order,Stats} from '@/lib/types';
import {Button} from './ui/button';
import {Reorder} from './reorder';
export function Delivered({order}:{order:Order}){
 const t=useTranslations('savings');const brand=useTranslations('brand');const reduced=useReducedMotion();const [stage,setStage]=useState(0);const [busy,setBusy]=useState(false);const [error,setError]=useState(false);const card=useRef<HTMLDivElement>(null);const stats=useQuery({queryKey:['stats'],queryFn:()=>api<Stats>('/stats')});
 useEffect(()=>{const timer=setTimeout(()=>setStage(1),reduced?0:800);const finish=setTimeout(()=>setStage(2),reduced?0:1800);return()=>{clearTimeout(timer);clearTimeout(finish);};},[reduced]);
 const save=async(share=false)=>{if(!card.current||busy)return;setBusy(true);setError(false);try{const {toBlob}=await import('html-to-image');const blob=await toBlob(card.current,{pixelRatio:2,backgroundColor:'#FFF4E6'});if(!blob)throw new Error();const file=new File([blob],`NeverEats-${order.id}.png`,{type:'image/png'});if(share&&navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:brand('name')});}else{const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=file.name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}}catch(e){if(!(e instanceof DOMException&&e.name==='AbortError'))setError(true);}finally{setBusy(false);}};
 return <section className="delivered"><motion.div className="door" initial={false} animate={stage>0?{rotateY:-70,opacity:.2}:{rotateY:0,opacity:1}} transition={{duration:reduced?0:.7}} aria-hidden="true">🚪</motion.div><h1>{t(stage===0?'opening':'emptyDoor')}</h1>{stage>=2&&<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}><h2>{t('saved',{cad:money(order.total_cents),cny:yuan(order.total_cents)})}</h2><div className="share-card" ref={card}><div className="share-brand"><svg aria-hidden="true" width="32" height="32" viewBox="0 0 36 36"><path d="M7 12h22v17H7zM7 12l5-6h12l5 6" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/></svg>{brand('name')}</div><p>{brand('tagline')}</p><div className="share-art" aria-hidden="true">☁</div><p>{order.restaurant.name_zh}</p><p className="share-items">{order.items.map(i=>`${i.name_zh_snapshot} ×${i.quantity}`).join(' · ')}</p><h2>{money(order.total_cents)}</h2><p>{t('yuan',{amount:yuan(order.total_cents)})}</p>{stats.data&&<p>{t('cumulative',{amount:money(stats.data.saved_cents)})}</p>}<p>{t('quote')}</p><small>{orderDate(order.placed_at)}</small></div><div className="actions"><Button disabled={busy} onClick={()=>save()}>{t('saveImage')}</Button><Button variant="outline" disabled={busy} onClick={()=>save(true)}>{t('share')}</Button></div>{error&&<p role="alert">{t('imageError')}</p>}<div className="actions"><Reorder order={order}/><Button asChild variant="outline"><Link href="/">{t('home')}</Link></Button></div></motion.div>}</section>;
}
