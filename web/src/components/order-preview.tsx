"use client";
import {useQuery} from '@tanstack/react-query';
import {useTranslations} from 'next-intl';
import {api} from '@/lib/api';
import {money,useStore} from '@/lib/store';
import type {Order} from '@/lib/types';
export function OrderPreview({id}:{id:string}){const guest=useStore(s=>s.guestId);const t=useTranslations('checkout');const q=useQuery({queryKey:['order',id],queryFn:()=>api<Order>(`/orders/${id}`),enabled:!!guest});return <><h1>{t('orderCreated')}</h1>{q.data?<p>{q.data.restaurant.name_zh} · {money(q.data.total_cents)}</p>:<p>{t(q.isError?'error':'loading')}</p>}</>;}
