"use client";
import Link from 'next/link';
import {useInfiniteQuery} from '@tanstack/react-query';
import {useTranslations} from 'next-intl';
import {api} from '@/lib/api';
import {money,useStore} from '@/lib/store';
import {orderDate} from '@/lib/savings';
import type {Order} from '@/lib/types';
import {Button} from './ui/button';
import {Reorder} from './reorder';
export function OrderHistory(){const t=useTranslations('history');const status=useTranslations('tracking.statuses');const guest=useStore(s=>s.guestId);const q=useInfiniteQuery({queryKey:['orders'],queryFn:({pageParam})=>api<Order[]>(`/orders?offset=${pageParam}&limit=20`),initialPageParam:0,getNextPageParam:(last,pages)=>last.length===20?pages.length*20:undefined,enabled:!!guest});return <><h1>{t('title')}</h1>{q.isLoading||!guest?<div className="skeleton" aria-label={t('loading')}/>:q.isError?<><p role="alert">{t('error')}</p><Button onClick={()=>q.refetch()}>{t('retry')}</Button></>:!q.data?.pages[0].length?<p>{t('empty')}</p>:q.data.pages.flat().map(o=><article className="history-card" key={o.id}><Link href={`/orders/${o.id}`}><h2>{o.restaurant.name_zh}</h2><p>{o.items.map(i=>i.name_zh_snapshot).join(' · ')}</p><p>{money(o.total_cents)} · {orderDate(o.placed_at)}</p><strong>{status(o.status)}</strong></Link><Reorder order={o}/></article>)}{q.hasNextPage&&<Button disabled={q.isFetchingNextPage} onClick={()=>q.fetchNextPage()}>{t('more')}</Button>}</>;}
