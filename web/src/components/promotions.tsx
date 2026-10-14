"use client";
import {useQuery} from '@tanstack/react-query';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {api} from '@/lib/api';
import {useStore} from '@/lib/store';
import type {Promotion} from '@/lib/types';
import {Button} from './ui/button';

export function Promotions(){
 const t=useTranslations('promotions');const guest=useStore(s=>s.guestId);
 const q=useQuery({queryKey:['promotions'],queryFn:()=>api<Promotion[]>('/promotions'),enabled:!!guest,refetchOnMount:'always'});
 return <><h1>{t('title')}</h1>{q.isLoading||!guest?<div className="skeleton" role="status" aria-label={t('loading')}/>:q.isError?<><p role="alert">{t('error')}</p><Button onClick={()=>q.refetch()}>{t('retry')}</Button></>:q.data?.length?<div className="promotion-list">{q.data.map(p=><article className="promotion-card" key={p.id}><strong>{t(p.kind==='half_off'?'halfOffTitle':'deliveryTitle')}</strong><span>{t(p.kind==='half_off'?'halfOffCondition':'deliveryCondition')}</span><small>{t('expires',{date:new Intl.DateTimeFormat('zh-CN').format(new Date(p.expires_at))})}</small></article>)}</div>:<p>{t('empty')}</p>}<Link className="text-link" href="/profile">{t('back')}</Link></>;
}
