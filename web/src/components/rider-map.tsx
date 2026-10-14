"use client";
import {useEffect,useRef,useState} from 'react';
import along from '@turf/along';
import length from '@turf/length';
import {useTranslations} from 'next-intl';
import {interpolate,routeOrigin} from '@/lib/timeline';
import {useStore} from '@/lib/store';
import type {Order} from '@/lib/types';
import 'mapbox-gl/dist/mapbox-gl.css';
export function RiderMap({order,speed,vehicle}:{order:Order;speed:number;vehicle:'bike'|'scooter'}){
 const container=useRef<HTMLDivElement>(null);const t=useTranslations('tracking');const address=useStore(s=>s.address);const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const token=process.env.NEXT_PUBLIC_MAPBOX_TOKEN;if(!token||!address||!container.current)return;
  let disposed=false;let frame=0;let map:import('mapbox-gl').Map|undefined;let marker:import('mapbox-gl').Marker|undefined;const controller=new AbortController();
  const cached=useStore.getState().routes[order.id];const destination=cached?.destination||address.coordinates;const origin=cached?.origin||routeOrigin(order.id,destination);
  const fallback={origin,destination,geometry:[origin,destination]};if(!cached)useStore.getState().setRoute(order.id,fallback);
  async function setup(){
   let geometry=cached?.geometry||[origin,destination];
   if(!cached){try{const response=await fetch(`https://api.mapbox.com/directions/v5/mapbox/cycling/${origin.join(',')};${destination.join(',')}?geometries=geojson&access_token=${token}`,{signal:controller.signal});if(!response.ok)throw new Error();const data=await response.json();if(data.routes?.[0]?.geometry?.coordinates?.length>1)geometry=data.routes[0].geometry.coordinates;}catch{}if(disposed)return;useStore.getState().setRoute(order.id,{origin,destination,geometry});}
   const mapbox=(await import('mapbox-gl')).default;if(disposed||!container.current)return;
   try{
    map=new mapbox.Map({container:container.current,accessToken:token,style:'mapbox://styles/mapbox/streets-v12',center:destination,zoom:13,attributionControl:true});
    map.on('error',()=>{if(!disposed)setFailed(true);});
    new mapbox.Marker({color:'#FF7A1A'}).setLngLat(origin).addTo(map);new mapbox.Marker({color:'#1F1A17'}).setLngLat(destination).addTo(map);
    const riderElement=document.createElement('div');riderElement.className=`map-rider-marker map-rider-marker-${vehicle}`;riderElement.setAttribute('aria-hidden','true');const vehicleIcon=document.createElement('span');vehicleIcon.textContent=vehicle==='bike'?'🚲':'🛵';riderElement.append(vehicleIcon);
    marker=new mapbox.Marker({element:riderElement,anchor:'center'}).setLngLat(origin).addTo(map);
    const route={type:'Feature' as const,properties:{},geometry:{type:'LineString' as const,coordinates:geometry}};
    map.on('load',()=>{if(!map||disposed)return;map.addSource('route',{type:'geojson',data:route});map.addLayer({id:'route',type:'line',source:'route',paint:{'line-color':'#FF7A1A','line-width':5}});const bounds=new mapbox.LngLatBounds(origin,destination);geometry.forEach(p=>bounds.extend(p));map.fitBounds(bounds,{padding:50,maxZoom:14,duration:0});});
    const picked=order.timeline.find(s=>s.status==='picked_up')!.offset_seconds;const assigned=order.timeline.find(s=>s.status==='courier_assigned')!.offset_seconds;const delivered=order.timeline.at(-1)!.offset_seconds;const approach:[number,number]=[origin[0]-.008,origin[1]-.004];const km=length(route);
    const tick=()=>{const elapsed=Math.max(0,(Date.now()-Date.parse(order.placed_at))/1000)*speed;const fraction=Math.max(0,Math.min(1,(elapsed-picked)/(delivered-picked)));const point=elapsed<picked?interpolate(approach,origin,(elapsed-assigned)/(picked-assigned)):along(route,fraction*km).geometry.coordinates as [number,number];marker?.setLngLat(point);if(marker)marker.getElement().style.display=elapsed>=assigned?"":"none";frame=requestAnimationFrame(tick);};tick();
   }catch{if(!disposed)setFailed(true);}
  }
  void setup();return()=>{disposed=true;controller.abort();cancelAnimationFrame(frame);marker?.remove();map?.remove();};
 },[address,order,speed,vehicle]);
 return <><div className="rider-map" ref={container} role="img" aria-label={t('mapLabel')}/>{(!process.env.NEXT_PUBLIC_MAPBOX_TOKEN||!address||failed)&&<p className="notice">{t('mapFallback')}</p>}</>;
}
