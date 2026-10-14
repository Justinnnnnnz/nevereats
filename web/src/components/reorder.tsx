"use client";
import {track} from "@/lib/analytics";
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';
import {useTranslations} from 'next-intl';
import {api} from '@/lib/api';
import {useStore} from '@/lib/store';
import type {Order,Restaurant} from '@/lib/types';
import {Button} from './ui/button';
import {Sheet} from './ui/sheet';
export function Reorder({order}:{order:Order}){
 const t=useTranslations('savings');const router=useRouter();const [confirm,setConfirm]=useState(false);
 const mutation=useMutation({mutationFn:async()=>{track("reorder_clicked",{restaurant_id:order.restaurant_id});const restaurant=await api<Restaurant>(`/restaurants/${order.restaurant_id}`);const lines=order.items.map(snapshot=>{const item=restaurant.sections.flatMap(s=>s.items).find(i=>i.id===snapshot.menu_item_id);if(!item)throw new Error();const ids=snapshot.selected_options.map(o=>o.id);const options=item.option_groups.flatMap(g=>g.options).filter(o=>ids.includes(o.id));if(options.length!==ids.length||!item.option_groups.every(g=>{const count=g.options.filter(o=>ids.includes(o.id)).length;return count>=g.min_select&&count<=g.max_select;}))throw new Error();return {key:item.id+ids.slice().sort().join(','),item,options,quantity:snapshot.quantity};});useStore.setState({restaurant,cart:lines});},onSuccess:()=>{setConfirm(false);router.push('/checkout');}});
 return <><Button disabled={mutation.isPending} onClick={()=>useStore.getState().cart.length?setConfirm(true):mutation.mutate()}>{t('reorder')}</Button>{mutation.isError&&<p role="alert">{t('reorderError')}</p>}<Sheet open={confirm} onOpenChange={setConfirm} title={t('replaceTitle')}><p>{t('replaceBody')}</p><Button disabled={mutation.isPending} onClick={()=>mutation.mutate()}>{t('replaceConfirm')}</Button></Sheet></>;
}
