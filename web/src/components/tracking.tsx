"use client";
import {useEffect,useRef,useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useTranslations} from 'next-intl';
import {api} from '@/lib/api';
import {useStore} from '@/lib/store';
import {statusAt} from '@/lib/timeline';
import type {Order} from '@/lib/types';
import {RiderMap} from './rider-map';
import {Button} from './ui/button';
import {Delivered} from './delivered';
export function Tracking({id,speed=1}:{id:string;speed?:number}){
 const t=useTranslations('tracking');const guest=useStore(s=>s.guestId);const asked=useStore(s=>s.notificationAsked);const q=useQuery({queryKey:['order',id],queryFn:()=>api<Order>(`/orders/${id}`),enabled:!!guest});const [now,setNow]=useState(0);const [toast,setToast]=useState('');const previous=useRef('');const order=q.data;
 useEffect(()=>{const tick=()=>setNow(Date.now());const timer=setInterval(tick,500);tick();return()=>clearInterval(timer);},[]);
 const status=order&&now?statusAt(order.placed_at,order.timeline,now,speed):'placed';
 useEffect(()=>{if(!order)return;if(previous.current&&previous.current!==status){const message=t(`statuses.${status}`);const timer=setTimeout(()=>setToast(message),0);const hide=setTimeout(()=>setToast(''),3500);if('Notification' in window&&Notification.permission==='granted')try{new Notification(t('notificationTitle'),{body:message});}catch{}previous.current=status;return()=>{clearTimeout(timer);clearTimeout(hide);};}previous.current=status;},[status,order,t]);
 if(q.isLoading||!guest||!now)return <div className="skeleton" aria-label={t('loading')}/>;
 if(q.isError||!order)return <><p role="alert">{t('error')}</p><Button onClick={()=>q.refetch()}>{t('retry')}</Button></>;
 const elapsed=Math.max(0,(now-Date.parse(order.placed_at))/1000)*speed;const duration=order.timeline.at(-1)!.offset_seconds;const remaining=Math.max(0,Math.ceil((duration-elapsed)/speed));const assigned=order.timeline.find(s=>s.status==='courier_assigned')!.offset_seconds;
 if(status==='delivered')return <Delivered order={order}/>;
 const courier=Math.min(9,Math.max(0,Number(order.courier_id.split('-')[1])||0));const delay=Math.floor(elapsed/35)%3;
 return <><h1>{t(`statuses.${status}`)}</h1><p>{order.restaurant.name_zh}</p><RiderMap order={order} speed={speed}/><section className="tracking-panel"><h2>{t('countdown',{minutes:Math.floor(remaining/60),seconds:remaining%60})}</h2><progress aria-label={t('progress')} max={duration} value={Math.min(duration,elapsed)}/><ol className="timeline">{order.timeline.map(s=><li key={s.status} className={elapsed>=s.offset_seconds?'complete':''}>{t(`statuses.${s.status}`)}</li>)}</ol>{elapsed>=assigned&&<div className="courier-card"><span aria-hidden="true">{courier%2?'🚲':'🛵'}</span><div><strong>{t(`couriers.${courier}.name`)}</strong><p>{t(`couriers.${courier}.bio`)}</p></div></div>}{status==='en_route'&&<p>{t(`delays.${delay}`)}</p>}{!asked&&<div><p>{t('notificationExplain')}</p><Button onClick={()=>{useStore.getState().setNotificationAsked();if('Notification' in window)void Notification.requestPermission().catch(()=>{});}}>{t('allowNotifications')}</Button><Button variant="outline" onClick={()=>useStore.getState().setNotificationAsked()}>{t('later')}</Button></div>}</section>{toast&&<div role="status" className="toast">{toast}</div>}</>;
}
