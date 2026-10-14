"use client";
import {restaurantCardImage} from '@/lib/images';
import {FoodImage} from './food-image';
import {useState} from 'react';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/api';
import {money,useStore} from '@/lib/store';
import type {Restaurant} from '@/lib/types';
import {AddressPicker} from './address-picker';
import {CartBar} from './cart-bar';
import {Button} from './ui/button';
export function Browse({search=false,initialRestaurants}:{search?:boolean;initialRestaurants?:Restaurant[]}){
 const t=useTranslations('browse');const categories=useTranslations('categories');const guest=useStore(s=>s.guestId);const [q,setQ]=useState('');const [category,setCategory]=useState('all');
 const data=useQuery({queryKey:['restaurants'],initialData:initialRestaurants,queryFn:()=>api<Restaurant[]>('/restaurants'),enabled:!!guest});
 const keys=['all','chinese','hotpot','tea','bbq','korean','pho','burger','pizza','local','dessert','late'] as const;
 const rows=data.data?.filter(r=>(category==='all'||(category==='late'?r.late_night:r.category===categories(category)))&&(r.name_zh+r.name_en+r.sections.flatMap(s=>s.items.map(i=>i.name_zh+i.name_en)).join('')).toLowerCase().includes(q.toLowerCase()))||[];
 const cards=(list:Restaurant[])=>list.map((r,index)=><Link prefetch={false} className="restaurant-card" key={r.id} href={`/restaurants/${r.id}`}><FoodImage src={restaurantCardImage(r.image_url)} alt={`${r.name_zh}招牌餐品`} eager={index===0} quality={50} /><div className="card-copy"><h3>{r.name_zh}</h3><p>{r.cuisine} · {r.neighborhood}</p><p>{t('restaurantMeta',{rating:r.rating,min:r.eta_min,max:r.eta_max,fee:money(r.delivery_fee_cents)})}</p></div></Link>);
 return <><AddressPicker/><h1>{t(search?'searchTitle':'homeTitle')}</h1><label className="field">{t('searchLabel')}<input type="search" value={q} onChange={e=>setQ(e.target.value)} placeholder={t('searchPlaceholder')}/></label><div className="chips">{keys.map(key=><button className={category===key?'selected':''} key={key} aria-pressed={category===key} onClick={()=>setCategory(key)}>{categories(key)}</button>)}</div>
 {data.isLoading||(!guest&&!data.data)?<div className="skeleton" role="status" aria-label={t('loading')}/>:data.isError?<div role="alert"><p>{t('error')}</p><Button onClick={()=>data.refetch()}>{t('retry')}</Button></div>:!rows.length?<p>{t('empty')}</p>:<>{!search&&!q&&category==='all'&&<section><h2>{t('lateNight')}</h2>{cards(rows.filter(r=>r.late_night).slice(0,3))}</section>}<section><h2>{t('popular')}</h2>{cards(rows)}</section></>}<CartBar/></>;
}
