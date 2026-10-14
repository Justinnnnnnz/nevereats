"use client";
import {track} from "@/lib/analytics";
import {motion,useReducedMotion} from 'framer-motion';
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
 const t=useTranslations('tracking');const guest=useStore(s=>s.guestId);const asked=useStore(s=>s.notificationAsked);const q=useQuery({queryKey:['order',id],queryFn:()=>api<Order>(`/orders/${id}`),enabled:!!guest});const [now,setNow]=useState(0);const [toast,setToast]=useState('');const previous=useRef('');const order=q.data;const reduced=useReducedMotion();
 useEffect(()=>{const tick=()=>setNow(Date.now());const timer=setInterval(tick,500);tick();return()=>clearInterval(timer);},[]);
 const status=order&&now?statusAt(order.placed_at,order.timeline,now,speed):'placed';
 useEffect(()=>{if(!order)return;track("order_status_viewed",{status});if(previous.current&&previous.current!==status){const message=t(`statuses.${status}`);const timer=setTimeout(()=>setToast(message),0);const hide=setTimeout(()=>setToast(''),3500);if('Notification' in window&&Notification.permission==='granted')try{new Notification(t('notificationTitle'),{body:message});}catch{}previous.current=status;return()=>{clearTimeout(timer);clearTimeout(hide);};}previous.current=status;},[status,order,t]);
 if(q.isLoading||!guest||!now)return <div className="skeleton" role="status" aria-label={t('loading')}/>;
 if(q.isError||!order)return <><p role="alert">{t('error')}</p><Button onClick={()=>q.refetch()}>{t('retry')}</Button></>;
 const elapsed=Math.max(0,(now-Date.parse(order.placed_at))/1000)*speed;const duration=order.timeline.at(-1)!.offset_seconds;const remaining=Math.max(0,Math.ceil((duration-elapsed)/speed));const assigned=order.timeline.find(s=>s.status==='courier_assigned')!.offset_seconds;
 if(status==='delivered')return <Delivered order={order}/>;
 const courier=Math.min(9,Math.max(0,Number(order.courier_id.split('-')[1])||0));const delay=Math.floor(elapsed/35)%3;const vehicle=courier%2?'bike':'scooter';const progress=Math.min(100,(elapsed/duration)*100);
 return <><motion.h1 key={status} initial={{opacity:0,y:reduced?0:10}} animate={{opacity:1,y:0}} transition={{duration:reduced?0:.28}}>{t(`statuses.${status}`)}</motion.h1><p>{order.restaurant.name_zh}</p><RiderMap order={order} speed={speed} vehicle={vehicle}/><section className="tracking-panel"><h2>{t('countdown',{minutes:Math.floor(remaining/60),seconds:remaining%60})}</h2><div className="tracking-progress" role="progressbar" aria-label={t('progress')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><motion.span initial={false} animate={{width:`${progress}%`}} transition={{duration:reduced?0:.55,ease:'easeOut'}}/></div><ol className="timeline">{order.timeline.map((s,index)=>{const complete=elapsed>=s.offset_seconds;const current=s.status===status;return <motion.li key={s.status} initial={{opacity:0,x:reduced?0:-8}} animate={{opacity:1,x:0}} transition={{duration:reduced?0:.24,delay:reduced?0:index*.035}} className={`${complete?'complete':''} ${current?'current':''}`} aria-current={current?'step':undefined}><span>{t(`statuses.${s.status}`)}</span></motion.li>;})}</ol>{elapsed>=assigned&&<motion.div className="courier-card" initial={{opacity:0,y:reduced?0:12,scale:reduced?1:.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:reduced?0:.3}}><span className={`courier-vehicle courier-vehicle-${vehicle}`} aria-hidden="true">{vehicle==='bike'?'🚲':'🛵'}</span><div><strong>{t(`couriers.${courier}.name`)}</strong><p>{t(`couriers.${courier}.bio`)}</p></div><span className="courier-live" aria-label={t('courierLive')}/></motion.div>}{status==='en_route'&&<p>{t(`delays.${delay}`)}</p>}{!asked&&<div><p>{t('notificationExplain')}</p><Button onClick={()=>{useStore.getState().setNotificationAsked();if('Notification' in window)void Notification.requestPermission().catch(()=>{});}}>{t('allowNotifications')}</Button><Button variant="outline" onClick={()=>useStore.getState().setNotificationAsked()}>{t('later')}</Button></div>}</section>{toast&&<div role="status" className="toast">{toast}</div>}</>;
}
