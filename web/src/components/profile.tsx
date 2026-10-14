"use client";
import Link from 'next/link';
import {useQuery} from '@tanstack/react-query';
import {useTranslations} from 'next-intl';
import {api} from '@/lib/api';
import {money,useStore} from '@/lib/store';
import {yuan} from '@/lib/savings';
import type {Stats} from '@/lib/types';
import {Button} from './ui/button';
export function Profile(){const t=useTranslations('profile');const shell=useTranslations('shell');const guest=useStore(s=>s.guestId);const q=useQuery({queryKey:['stats'],queryFn:()=>api<Stats>('/stats'),enabled:!!guest});return <><h1>{t('title')}</h1>{q.isLoading||!guest?<div className="skeleton" role="status" aria-label={t('loading')}/>:q.isError?<><p role="alert">{t('error')}</p><Button onClick={()=>q.refetch()}>{t('retry')}</Button></>:q.data&&<><section className="stats-card"><p>{t('total')}</p><h2>{money(q.data.saved_cents)}</h2><p>{t('yuan',{amount:yuan(q.data.saved_cents)})}</p></section><dl className="stats-list"><div><dt>{t('count')}</dt><dd>{q.data.order_count}</dd></div><div><dt>{t('favorite')}</dt><dd>{q.data.favorite_restaurant||t('none')}</dd></div><div><dt>{t('hour')}</dt><dd>{q.data.top_hour===null?t('none'):t('hourValue',{hour:q.data.top_hour})}</dd></div></dl>{q.data.order_count===0&&<p>{t('empty')}</p>}</>}<Link className="benefit-link" href="/promotions"><span>{t('coupon')}</span><span aria-hidden="true">›</span></Link><div className="coming-soon"><span>{t('login')}</span><small>{t('soon')}</small></div><p className="notice">{shell('notice')}</p></>;}
