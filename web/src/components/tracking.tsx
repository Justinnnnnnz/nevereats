"use client";
import {track} from '@/lib/analytics';
import {AnimatePresence,motion,useReducedMotion} from 'framer-motion';
import {useCallback,useEffect,useRef,useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useTranslations} from 'next-intl';
import {api} from '@/lib/api';
import {useStore} from '@/lib/store';
import {statusAt} from '@/lib/timeline';
import {illustrationStageFor,progressSegmentFor,vehicleForCourier} from '@/lib/tracking-visuals';
import type {Order} from '@/lib/types';
import {RiderMap} from './rider-map';
import {Button} from './ui/button';
import {Delivered} from './delivered';
import {TrackingIllustration} from './tracking-illustration';

export function Tracking({id,speed=1}:{id:string;speed?:number}){
 const t=useTranslations('tracking');const guest=useStore(s=>s.guestId);const asked=useStore(s=>s.notificationAsked);const query=useQuery({queryKey:['order',id],queryFn:()=>api<Order>(`/orders/${id}`),enabled:!!guest});const [now,setNow]=useState(0);const [toast,setToast]=useState('');const [deliveryRevealed,setDeliveryRevealed]=useState(false);const previous=useRef('');const toastTimer=useRef<number|undefined>(undefined);const order=query.data;const reduced=useReducedMotion()??false;
 const showToast=useCallback((message:string)=>{setToast(message);if(toastTimer.current)window.clearTimeout(toastTimer.current);toastTimer.current=window.setTimeout(()=>setToast(''),2800);},[]);
 useEffect(()=>{const tick=()=>setNow(Date.now());const timer=window.setInterval(tick,speed>=60?80:500);tick();return()=>window.clearInterval(timer);},[speed]);
 const status=order&&now?statusAt(order.placed_at,order.timeline,now,speed):'placed';
 useEffect(()=>{if(!order)return;track('order_status_viewed',{status});if(previous.current&&previous.current!==status){const message=t(`statuses.${status}`);showToast(message);if('Notification'in window&&Notification.permission==='granted')try{new Notification(t('notificationTitle'),{body:message});}catch{}}previous.current=status;},[status,order,t,showToast]);
 useEffect(()=>{if(status!=='delivered')return;const timer=window.setTimeout(()=>setDeliveryRevealed(true),reduced?900:1400);return()=>window.clearTimeout(timer);},[status,reduced]);
 if(query.isLoading||!guest||!now)return <div className="skeleton" role="status" aria-label={t('loading')}/>;
 if(query.isError||!order)return <><p role="alert">{t('error')}</p><Button onClick={()=>query.refetch()}>{t('retry')}</Button></>;
 if(status==='delivered'&&deliveryRevealed)return <Delivered order={order}/>;
 const elapsed=Math.max(0,(now-Date.parse(order.placed_at))/1000)*speed;const remaining=Math.max(0,Math.ceil((order.timeline.at(-1)!.offset_seconds-elapsed)/speed));const arrival=new Intl.DateTimeFormat('zh-CN',{timeZone:'America/Toronto',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(now+remaining*1000));const assigned=order.timeline.find(s=>s.status==='courier_assigned')!.offset_seconds;const courier=Math.min(9,Math.max(0,Number(order.courier_id.split('-')[1])||0));const vehicle=vehicleForCourier(order.courier_id);const stage=illustrationStageFor(status);const activeSegment=progressSegmentFor(status);const delay=Math.floor(elapsed/35)%3;const labels=['ordered','making','onTheWay','complete'];
 return <div className="tracking-page"><header className="tracking-status"><AnimatePresence mode="wait" initial={false}><motion.div key={status} initial={{opacity:0,y:reduced?0:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-5}} transition={{duration:reduced?0:.2}}><h1>{t('eta',{time:arrival})}</h1><p>{t(`statusCopy.${status}`)}</p></motion.div></AnimatePresence></header>
  <div className="tracking-segments" role="group" aria-label={t('progress')}>{labels.map((key,index)=><div className={`tracking-segment ${index<activeSegment?'segment-complete':''} ${index===activeSegment?'segment-current':''}`} key={key} aria-current={index===activeSegment?'step':undefined}><span className="segment-track">{index<activeSegment&&<span className="segment-fill"/>}{index===activeSegment&&!reduced&&<motion.span className="segment-shimmer" animate={{x:['-55%','155%']}} transition={{duration:1.9,repeat:Infinity,ease:'linear'}}/>}</span><small>{t(`progressSteps.${key}`)}</small></div>)}</div>
  <AnimatePresence mode="wait" initial={false}><motion.div key={stage} initial={{opacity:0,y:reduced?0:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-4}} transition={{duration:reduced?0:.24}}><TrackingIllustration stage={stage} vehicle={vehicle} reduced={reduced}/></motion.div></AnimatePresence>
  <p className="tracking-restaurant">{order.restaurant.name_zh}</p><RiderMap order={order} speed={speed} vehicle={vehicle}/>
  <section className="tracking-panel">
  {elapsed>=assigned&&<motion.div className="courier-card" initial={{opacity:0,y:reduced?0:16}} animate={{opacity:1,y:0}} transition={{duration:reduced?0:.32}}><div className={`courier-avatar courier-avatar-${courier%4}`} aria-hidden="true">{t(`couriers.${courier}.name`).slice(0,1)}</div><div className="courier-info"><strong>{t(`couriers.${courier}.name`)} <span className="courier-rating">{(4.7+(courier%4)*.1).toFixed(1)} ★</span></strong><p>{t(`vehicles.${vehicle}`)} · NE {String(2048+courier*137).padStart(4,'0')}</p></div><span className="courier-live" aria-label={t('courierLive')}/><div className="courier-actions"><Button variant="outline" onClick={()=>showToast(t('contactUnavailable'))}>{t('message')}</Button><Button variant="outline" onClick={()=>showToast(t('contactUnavailable'))}>{t('call')}</Button></div></motion.div>}
  {status==='en_route'&&<p>{t(`delays.${delay}`)}</p>}{!asked&&<div><p>{t('notificationExplain')}</p><Button onClick={()=>{useStore.getState().setNotificationAsked();if('Notification'in window)void Notification.requestPermission().catch(()=>{});}}>{t('allowNotifications')}</Button><Button variant="outline" onClick={()=>useStore.getState().setNotificationAsked()}>{t('later')}</Button></div>}</section>{toast&&<div role="status" className="toast">{toast}</div>}</div>;
}
