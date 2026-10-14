"use client";
import {track} from "@/lib/analytics";
import {useEffect,useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {api} from '@/lib/api';
import {money,useStore} from '@/lib/store';
import type {MenuItem,Restaurant as RestaurantType} from '@/lib/types';
import {Sheet} from './ui/sheet';
import {Button} from './ui/button';
import {CartBar} from './cart-bar';
export function Restaurant({id}:{id:string}){
 const t=useTranslations('browse');const guest=useStore(s=>s.guestId);const query=useQuery({queryKey:['restaurant',id],queryFn:()=>api<RestaurantType>(`/restaurants/${id}`),enabled:!!guest});
 useEffect(()=>{if(query.data)track("restaurant_viewed",{restaurant_id:query.data.id});},[query.data]);
 const [item,setItem]=useState<MenuItem|null>(null);const [selected,setSelected]=useState<string[]>([]);const [quantity,setQuantity]=useState(1);const [replace,setReplace]=useState(false);const [feedback,setFeedback]=useState<string|null>(null);
 if(query.isLoading||!guest)return <div className="skeleton" role="status" aria-label={t('loading')}/>;
 if(query.isError)return <><p role="alert">{t('error')}</p><Button onClick={()=>query.refetch()}>{t('retry')}</Button></>;
 const r=query.data;if(!r)return <p>{t('empty')}</p>;
 const options=item?.option_groups.flatMap(g=>g.options).filter(o=>selected.includes(o.id))||[];
 const valid=item?.option_groups.every(g=>{const n=g.options.filter(o=>selected.includes(o.id)).length;return n>=g.min_select&&n<=g.max_select;});
 const add=(force=false)=>{if(!item)return;const key=item.id+selected.slice().sort().join(",");const existing=useStore.getState().cart.find(x=>x.key===key);if(!force&&existing&&existing.quantity+quantity>99){setFeedback(t("quantityLimit"));setTimeout(()=>setFeedback(null),2500);return;}const ok=useStore.getState().add(r,{key:item.id+selected.slice().sort().join(','),item,options,quantity},force);if(ok){track("item_added",{restaurant_id:r.id,menu_item_id:item.id});setItem(null);setReplace(false);setFeedback(t("added"));setTimeout(()=>setFeedback(null),1500);}else setReplace(true);};
 return <><div className="food-art hero" aria-hidden="true">🍲</div><h1>{r.name_zh}</h1><p>{t('restaurantMeta',{rating:r.rating,min:r.eta_min,max:r.eta_max,fee:money(r.delivery_fee_cents)})}</p><div className="section-tabs">{r.sections.map(s=><a href={`#${s.id}`} key={s.id}>{s.name_zh}</a>)}</div>{r.sections.map(s=><section key={s.id} id={s.id}><h2>{s.name_zh}</h2>{s.items.map(i=><button className="menu-item" key={i.id} onClick={()=>{setItem(i);setQuantity(1);setSelected(i.option_groups.flatMap(g=>g.min_select?g.options.slice(0,g.min_select).map(o=>o.id):[]));}}><div><h3>{i.name_zh} <small>{i.name_en}</small></h3><p>{i.description_zh}</p><strong>{money(i.price_cents)}</strong>{i.cny_reference_price!==null&&<p className="reference">{t('cnyReference',{price:i.cny_reference_price})}</p>}</div><span className="food-art small" aria-hidden="true">🥡</span></button>)}</section>)}
 <Sheet open={!!item} onOpenChange={v=>{if(!v)setItem(null);}} title={item?.name_zh||t('options')}>
 {item?.option_groups.map(g=><fieldset key={g.id}><legend>{g.name_zh} · {t('selectRange',{min:g.min_select,max:g.max_select})}</legend>{g.options.map(o=><label className="option" key={o.id}><input type={g.max_select===1?'radio':'checkbox'} name={g.id} checked={selected.includes(o.id)} onChange={()=>setSelected(previous=>g.max_select===1?[...previous.filter(x=>!g.options.some(z=>z.id===x)),o.id]:previous.includes(o.id)?previous.filter(x=>x!==o.id):[...previous,o.id])}/>{o.name_zh}{o.price_delta_cents>0&&` +${money(o.price_delta_cents)}`}</label>)}</fieldset>)}
 <div className="quantity"><Button variant="outline" aria-label={t('decrease')} disabled={quantity===1} onClick={()=>setQuantity(quantity-1)}>−</Button><output>{quantity}</output><Button variant="outline" aria-label={t('increase')} disabled={quantity===99} onClick={()=>setQuantity(quantity+1)}>+</Button></div><Button className="wide" disabled={!valid} onClick={()=>add()}>{t('add',{price:money(((item?.price_cents||0)+options.reduce((n,o)=>n+o.price_delta_cents,0))*quantity)})}</Button></Sheet>
 <Sheet open={replace} onOpenChange={setReplace} title={t('replaceTitle')}><p>{t('replaceBody')}</p><Button onClick={()=>add(true)}>{t('replaceConfirm')}</Button><Button variant="outline" onClick={()=>setReplace(false)}>{t('cancel')}</Button></Sheet>
 {feedback&&<motion.div role="status" className="toast" initial={{x:"-50%",scale:.8}} animate={{x:"-50%",scale:1}}>{feedback}</motion.div>}<CartBar/></>;
}
