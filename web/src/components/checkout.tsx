"use client";
import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import {useMutation,useQueryClient} from '@tanstack/react-query';
import {api} from '@/lib/api';
import {cartSubtotal,money,useStore} from '@/lib/store';
import {fees,parseCents} from '@/lib/fees';
import type {Order} from '@/lib/types';
import {AddressPicker} from './address-picker';
import {Button} from './ui/button';
export function Checkout(){
 const t=useTranslations('checkout');const common=useTranslations('browse');const notice=useTranslations('shell');const router=useRouter();const queryClient=useQueryClient();
 const cart=useStore(s=>s.cart);const restaurant=useStore(s=>s.restaurant);const address=useStore(s=>s.address);
 const [express,setExpress]=useState(false);const [tip,setTip]=useState('18');const [custom,setCustom]=useState('0');const [code,setCode]=useState('');const [couponChecked,setCouponChecked]=useState(false);const [phase,setPhase]=useState<'idle'|'scan'|'success'>('idle');
 const cents=parseCents(custom);const totals=fees(cartSubtotal(cart),restaurant?.delivery_fee_cents||0,express,tip,cents||0,Number(process.env.NEXT_PUBLIC_HST_PERCENT||13));
 const mutation=useMutation({mutationFn:async()=>{setPhase('scan');await new Promise(r=>setTimeout(r,1200));setPhase('success');await new Promise(r=>setTimeout(r,600));return api<Order>('/orders',{method:'POST',body:JSON.stringify({restaurant_id:restaurant?.id,items:cart.map(x=>({menu_item_id:x.item.id,quantity:x.quantity,option_ids:x.options.map(o=>o.id)})),tip_mode:tip,tip_custom_cents:tip==='custom'?cents:0,express,client_total_cents:totals.total_cents})});},onSuccess:order=>{queryClient.setQueryData(['order',order.id],order);void queryClient.invalidateQueries({queryKey:['orders']});void queryClient.invalidateQueries({queryKey:['stats']});useStore.getState().clear();router.push(`/orders/${order.id}`);},onError:()=>setPhase('idle')});
 if(!cart.length||!restaurant)return <><h1>{t('title')}</h1><p>{t('empty')}</p><Button asChild><Link href="/">{t('back')}</Link></Button></>;
 return <><h1>{t('title')}</h1><AddressPicker/><h2>{restaurant.name_zh}</h2>{cart.map(x=><div className="checkout-item" key={x.key}><span>{x.item.name_zh}<small>{x.options.map(o=>o.name_zh).join(' · ')}</small></span><div><button aria-label={common('decrease')} disabled={mutation.isPending} onClick={()=>useStore.getState().setQuantity(x.key,x.quantity-1)}>−</button> {x.quantity} <button aria-label={common('increase')} disabled={mutation.isPending||x.quantity===99} onClick={()=>useStore.getState().setQuantity(x.key,x.quantity+1)}>+</button></div></div>)}
 <fieldset disabled={mutation.isPending}><legend>{t('delivery')}</legend>{[false,true].map(v=><label className="option" key={String(v)}><input type="radio" name="delivery" checked={express===v} onChange={()=>setExpress(v)}/>{t(v?'express':'standard')}</label>)}</fieldset>
 <fieldset disabled={mutation.isPending}><legend>{t('tip')}</legend><div className="chips">{['0','15','18','20','25','custom'].map(v=><button type="button" key={v} className={tip===v?'selected':''} aria-pressed={tip===v} onClick={()=>setTip(v)}>{v==='custom'?t('custom'):`${v}%`}</button>)}</div>{tip==='custom'&&<label className="field">{t('customAmount')}<input inputMode="decimal" value={custom} onChange={e=>setCustom(e.target.value)}/>{(cents===null||cents>100000)&&<span role="alert">{t('invalidTip')}</span>}</label>}{tip==='0'&&<p>{t('sadCourier')}</p>}</fieldset>
 <section>{Object.entries(totals).map(([key,value])=><div className={`fee-line ${key==='total_cents'?'total':''}`} key={key}><span>{t(`fees.${key}`)} <button className="info" aria-label={t(`explanations.${key}`)} onClick={e=>{const next=e.currentTarget.nextElementSibling as HTMLElement;next.hidden=!next.hidden;}}>ⓘ</button><small hidden>{t(`explanations.${key}`)}</small></span><strong>{money(value)}</strong></div>)}</section>
 <label className="field">{t('coupon')}<input value={code} disabled={mutation.isPending} onChange={e=>{setCode(e.target.value);setCouponChecked(false);}}/></label><Button variant="outline" disabled={!code.trim()||mutation.isPending} onClick={()=>setCouponChecked(true)}>{t('apply')}</Button>{couponChecked&&<p role="status">{t('expired')}</p>}
 <h2>{t('payment')}</h2><p><svg aria-hidden="true" width="40" height="32" viewBox="0 0 40 32"><path d="M8 17C1 17 1 7 9 7C11 0 22 1 24 8C33 8 33 17 26 17M12 17h22v12H12zM26 21h8" fill="none" stroke="currentColor" strokeWidth="2"/></svg>{t('pretendPay')}</p><Button className="wide" disabled={!address||mutation.isPending||(tip==='custom'&&(cents===null||cents>100000))} onClick={()=>mutation.mutate()}>{t('pay',{price:money(totals.total_cents)})}</Button>{mutation.isError&&<p role="alert">{t('error')}</p>}<p className="notice">{notice('notice')}</p>
 {phase!=='idle'&&<div className="payment-overlay" role="status" aria-live="polite">{phase==='scan'?<motion.div className="scan-ring" animate={{rotate:360}} transition={{duration:1.2,repeat:Infinity,ease:'linear'}}/>:<div className="payment-check">✓</div>}<p>{t(phase==='scan'?'scanning':'paid',{price:money(totals.total_cents)})}</p></div>}</>;
}
