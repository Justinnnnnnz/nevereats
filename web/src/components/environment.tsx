"use client";
import {useEffect,useState} from 'react';
import {useTranslations} from 'next-intl';
import {initMonitoring,track} from '@/lib/analytics';
export function Environment(){const t=useTranslations('polish');const [wechat,setWechat]=useState(false);useEffect(()=>{const timer=setTimeout(()=>setWechat(/MicroMessenger/i.test(navigator.userAgent)),0);track('app_opened');initMonitoring();let registrationTimer:ReturnType<typeof setTimeout>|undefined;const register=()=>{registrationTimer=setTimeout(()=>{if(process.env.NODE_ENV==='production'&&'serviceWorker' in navigator)void navigator.serviceWorker.register('/sw.js').catch(()=>{});},5000);};if(document.readyState==='complete')register();else window.addEventListener('load',register,{once:true});return()=>{clearTimeout(timer);clearTimeout(registrationTimer);window.removeEventListener('load',register);};},[]);return wechat?<p className="wechat-notice" role="status">{t('wechat')}</p>:null;}
