"use client";
import {useEffect,useRef,useState} from 'react';
import along from '@turf/along';
import length from '@turf/length';
import {useTranslations} from 'next-intl';
import {interpolate,routeOrigin} from '@/lib/timeline';
import {useStore} from '@/lib/store';
import type {Order} from '@/lib/types';
import type {Vehicle} from '@/lib/tracking-visuals';
import 'mapbox-gl/dist/mapbox-gl.css';
function vehicleIcon(vehicle:Vehicle){
 const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 32 32');svg.setAttribute('aria-hidden','true');svg.classList.add('map-vehicle-icon');
 const path=(d:string,fill='none')=>{const node=document.createElementNS(ns,'path');node.setAttribute('d',d);node.setAttribute('fill',fill);node.setAttribute('stroke','currentColor');node.setAttribute('stroke-width','2.5');node.setAttribute('stroke-linecap','round');node.setAttribute('stroke-linejoin','round');svg.append(node);};
 const circle=(cx:number,cy:number,r:number)=>{const node=document.createElementNS(ns,'circle');node.setAttribute('cx',String(cx));node.setAttribute('cy',String(cy));node.setAttribute('r',String(r));node.setAttribute('fill','var(--card)');node.setAttribute('stroke','currentColor');node.setAttribute('stroke-width','2.5');svg.append(node);};
 if(vehicle==='bike'){circle(7,24,5);circle(25,24,5);path('M7 24l7-11 6 11H7l8-8h7l3 8M11 11H7m15 0h4');}
 if(vehicle==='scooter'){circle(8,25,4);circle(24,25,4);path('M8 24h15l-3-13h6l2 14M20 11h6M11 22l9-2');}
 if(vehicle==='car'){path('M8 25V12l3-6h10l3 6 2 13z','var(--primary)');path('M10 13h12M10 21h12');circle(9,25,2);circle(23,25,2);}
 if(vehicle==='walk'){circle(16,5,3);path('M16 9v9m0-6-6 5m6-5 6 5m-6 1-5 8m5-8 6 8');}
 return svg;
}
function heading(from:[number,number],to:[number,number]){return (Math.atan2(to[0]-from[0],to[1]-from[1])*180/Math.PI+360)%360;}

export function RiderMap({order,speed,vehicle}:{order:Order;speed:number;vehicle:Vehicle}){
 const container=useRef<HTMLDivElement>(null);const t=useTranslations('tracking');const address=useStore(s=>s.address);const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const token=process.env.NEXT_PUBLIC_MAPBOX_TOKEN;if(!token||!address||!container.current)return;
  let disposed=false;let frame=0;let map:import('mapbox-gl').Map|undefined;let marker:import('mapbox-gl').Marker|undefined;const controller=new AbortController();
  const cached=useStore.getState().routes[order.id];const destination=cached?.destination||address.coordinates;const origin=cached?.origin||routeOrigin(order.id,destination);
  const fallback={origin,destination,geometry:[origin,destination]};if(!cached)useStore.getState().setRoute(order.id,fallback);
  async function setup(){
   let geometry=cached?.geometry||[origin,destination];
   if(!cached){try{const profile=vehicle==='bike'?'cycling':vehicle==='walk'?'walking':'driving';const response=await fetch(`https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin.join(',')};${destination.join(',')}?geometries=geojson&access_token=${token}`,{signal:controller.signal});if(!response.ok)throw new Error();const data=await response.json();if(data.routes?.[0]?.geometry?.coordinates?.length>1)geometry=data.routes[0].geometry.coordinates;}catch{}if(disposed)return;useStore.getState().setRoute(order.id,{origin,destination,geometry});}
   const mapbox=(await import('mapbox-gl')).default;if(disposed||!container.current)return;
   try{
    map=new mapbox.Map({container:container.current,accessToken:token,style:'mapbox://styles/mapbox/streets-v12',center:destination,zoom:13,attributionControl:true});
    map.on('error',()=>{if(!disposed)setFailed(true);});
    new mapbox.Marker({color:'#FF7A1A'}).setLngLat(origin).addTo(map);new mapbox.Marker({color:'#1F1A17'}).setLngLat(destination).addTo(map);
    const riderElement=document.createElement('div');riderElement.className=`map-rider-marker map-rider-marker-${vehicle}`;riderElement.setAttribute('aria-hidden','true');const icon=vehicleIcon(vehicle);riderElement.append(icon);
    marker=new mapbox.Marker({element:riderElement,anchor:'center'}).setLngLat(origin).addTo(map);
    const route={type:'Feature' as const,properties:{},geometry:{type:'LineString' as const,coordinates:geometry}};
    map.on('load',()=>{if(!map||disposed)return;map.addSource('route',{type:'geojson',data:route});map.addLayer({id:'route',type:'line',source:'route',paint:{'line-color':'#FF7A1A','line-width':5}});const bounds=new mapbox.LngLatBounds(origin,destination);geometry.forEach(p=>bounds.extend(p));map.fitBounds(bounds,{padding:50,maxZoom:14,duration:0});});
    const picked=order.timeline.find(s=>s.status==='picked_up')!.offset_seconds;const assigned=order.timeline.find(s=>s.status==='courier_assigned')!.offset_seconds;const delivered=order.timeline.at(-1)!.offset_seconds;const approach:[number,number]=[origin[0]-.008,origin[1]-.004];const km=length(route);
    const tick=()=>{const elapsed=Math.max(0,(Date.now()-Date.parse(order.placed_at))/1000)*speed;const fraction=Math.max(0,Math.min(1,(elapsed-picked)/(delivered-picked)));const point=elapsed<picked?interpolate(approach,origin,Math.max(0,Math.min(1,(elapsed-assigned)/(picked-assigned)))):along(route,fraction*km).geometry.coordinates as [number,number];const next=elapsed<picked?origin:along(route,Math.min(km,fraction*km+.01)).geometry.coordinates as [number,number];marker?.setLngLat(point);icon.style.transform=`rotate(${heading(point,next)}deg)`;if(marker)marker.getElement().style.display=elapsed>=assigned?"":"none";frame=requestAnimationFrame(tick);};tick();
   }catch{if(!disposed)setFailed(true);}
  }
  void setup();return()=>{disposed=true;controller.abort();cancelAnimationFrame(frame);marker?.remove();map?.remove();};
 },[address,order,speed,vehicle]);
 return <><div className="rider-map" ref={container} role="img" aria-label={t('mapLabel')}/>{(!process.env.NEXT_PUBLIC_MAPBOX_TOKEN||!address||failed)&&<p className="notice">{t('mapFallback')}</p>}</>;
}
