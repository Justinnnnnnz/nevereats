"use client";
import {useMutation,useQuery,useQueryClient} from '@tanstack/react-query';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {api} from '@/lib/api';
import {useStore} from '@/lib/store';
import type {Membership} from '@/lib/types';
import {Button} from './ui/button';

export function MembershipPage(){
 const t=useTranslations('membership');const guest=useStore(s=>s.guestId);const cache=useQueryClient();
 const q=useQuery({queryKey:['membership'],queryFn:()=>api<Membership>('/membership'),enabled:!!guest});
 const change=useMutation({mutationFn:(active:boolean)=>api<Membership>('/membership',{method:active?'POST':'DELETE'}),onSuccess:value=>{cache.setQueryData(['membership'],value);void cache.invalidateQueries({queryKey:['promotions']});}});
 const cancel=()=>{if(window.confirm(t('confirmCancel')))change.mutate(false);};
 return <><h1>{t('title')}</h1><section className="membership-card"><h2>{t('headline')}</h2><ul><li>{t('benefitDelivery')}</li><li>{t('benefitService')}</li></ul>{q.isLoading||!guest?<div className="skeleton" role="status" aria-label={t('title')}/>:q.isError?<><p role="alert">{t('error')}</p><Button variant="outline" onClick={()=>q.refetch()}>{t('retry')}</Button></>:<Button className="wide" disabled={q.data?.active||change.isPending} onClick={()=>change.mutate(true)}>{q.data?.active?t('active'):t('activate')}</Button>}</section>{q.data?.active&&<button type="button" className="cancel-membership" disabled={change.isPending} onClick={cancel}>{t('cancel')}</button>}<Link className="text-link" href="/profile">{t('back')}</Link></>;
}
