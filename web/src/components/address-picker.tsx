"use client";
import {useEffect,useState} from 'react';
import {useTranslations} from 'next-intl';
import {useStore} from '@/lib/store';
import type {Address} from '@/lib/types';
import {Sheet} from './ui/sheet';
import {Button} from './ui/button';
export function AddressPicker(){
 const t=useTranslations('browse');const address=useStore(s=>s.address);const guestId=useStore(s=>s.guestId);
 const [open,setOpen]=useState(false);const [query,setQuery]=useState('');const [results,setResults]=useState<Address[]>([]);
 const token=process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
 const quick:[string,[number,number]][]=[['robarts',[-79.399,43.6645]],['dorm',[-79.398,43.663]],['office',[-79.3832,43.6532]],['tower',[-79.3871,43.6426]]];
 useEffect(()=>{if(query.length<3||!token)return;const controller=new AbortController();const timer=setTimeout(()=>{fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&autocomplete=true&country=CA&proximity=-79.3832,43.6532&access_token=${token}`,{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(data=>setResults(data.features.map((f:{properties:{full_address?:string;name:string};geometry:{coordinates:[number,number]}})=>({name:f.properties.full_address||f.properties.name,coordinates:f.geometry.coordinates})))).catch(()=>setResults([]));},300);return()=>{clearTimeout(timer);controller.abort();};},[query,token]);
 const choose=(a:Address)=>{useStore.getState().setAddress(a);setOpen(false);setQuery('');setResults([]);};
 return <><button className="address-row" onClick={()=>setOpen(true)}>{t('deliverTo')} · {address?.name||t('chooseAddress')} <span aria-hidden="true">⌄</span></button><Sheet open={open||Boolean(guestId&&!address)} onOpenChange={setOpen} title={t('where')}>
 {token&&<label className="field">{t('addressSearch')}<input value={query} onChange={e=>{setQuery(e.target.value);setResults([]);}} autoComplete="off"/></label>}
 {results.map(a=><button className="quick-address" key={a.name} onClick={()=>choose(a)}>{a.name}</button>)}
 <p>{t('quickAddresses')}</p>{quick.map(([key,coordinates])=><Button variant="outline" className="quick-address" key={key} onClick={()=>choose({name:t(key),coordinates})}>{t(key)}</Button>)}<p className="notice">{t('addressPrivacy')}</p></Sheet></>;
}
