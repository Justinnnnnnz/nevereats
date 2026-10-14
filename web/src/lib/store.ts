"use client";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type {Address, CartLine, Restaurant} from "./types";
const memory = new Map<string,string>();
const storage: StateStorage = {
 getItem: name => { try { return localStorage.getItem(name) ?? memory.get(name) ?? null; } catch { return memory.get(name) ?? null; } },
 setItem: (name,value) => { memory.set(name,value); try { localStorage.setItem(name,value); } catch {} },
 removeItem: name => {memory.delete(name);try {localStorage.removeItem(name);} catch {} }
};
type State={guestId:string;address:Address|null;restaurant:Restaurant|null;cart:CartLine[];notificationAsked:boolean;routes:Record<string,{origin:[number,number];destination:[number,number];geometry:[number,number][]}>;initGuest:()=>void;setAddress:(a:Address)=>void;add:(r:Restaurant,line:CartLine,replace?:boolean)=>boolean;clear:()=>void;setQuantity:(key:string,n:number)=>void;setNotificationAsked:()=>void;setRoute:(id:string,route:State['routes'][string])=>void;};
export const useStore=create<State>()(persist((set,get)=>({
 guestId:"",address:null,restaurant:null,cart:[],notificationAsked:false,routes:{},
 initGuest:()=>{if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(get().guestId)) set({guestId:crypto.randomUUID()});},
 setAddress:address=>set({address}),
 add:(restaurant,line,replace=false)=>{const s=get();if(s.restaurant&&s.restaurant.id!==restaurant.id&&s.cart.length&&!replace)return false;const cart=replace?[]:s.cart.map(x=>({...x}));const found=cart.find(x=>x.key===line.key);if(found) {if(found.quantity+line.quantity>99)return false;found.quantity+=line.quantity;}else cart.push(line);set({restaurant,cart});return true;},
 clear:()=>set({cart:[],restaurant:null}),
 setQuantity:(key,n)=>set(s=>({cart:s.cart.map(x=>x.key===key?{...x,quantity:Math.min(99,n)}:x).filter(x=>x.quantity>0)})),
 setNotificationAsked:()=>set({notificationAsked:true}),
 setRoute:(id,route)=>set(s=>({routes:{...s.routes,[id]:route}}))
}),{name:"nevereats-guest",storage:createJSONStorage(()=>storage),skipHydration:true}));
export const cartSubtotal=(cart:CartLine[])=>cart.reduce((sum,x)=>sum+(x.item.price_cents+x.options.reduce((n,o)=>n+o.price_delta_cents,0))*x.quantity,0);
export const money=(cents:number)=>new Intl.NumberFormat('zh-CN',{style:'currency',currency:'CAD'}).format(cents/100);
