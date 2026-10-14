/// <reference lib="webworker" />
import {Serwist,NetworkFirst,CacheFirst,ExpirationPlugin,type PrecacheEntry,type SerwistGlobalConfig} from 'serwist';
declare global {interface WorkerGlobalScope extends SerwistGlobalConfig {__SW_MANIFEST:(PrecacheEntry|string)[]|undefined;}}
declare const self:ServiceWorkerGlobalScope;
const serwist=new Serwist({precacheEntries:self.__SW_MANIFEST,skipWaiting:true,clientsClaim:true,navigationPreload:true,runtimeCaching:[
 {matcher:({request,url})=>url.origin===self.location.origin&&request.mode==='navigate',handler:new NetworkFirst({cacheName:'nevereats-shell',networkTimeoutSeconds:3,plugins:[new ExpirationPlugin({maxEntries:10,maxAgeSeconds:86400})]})},
 {matcher:({request,url})=>url.origin===self.location.origin&&['style','script','font','image'].includes(request.destination),handler:new CacheFirst({cacheName:'nevereats-assets',plugins:[new ExpirationPlugin({maxEntries:150,maxAgeSeconds:604800})]})}
],fallbacks:{entries:[{url:'/offline',matcher:({request})=>request.destination==='document'}]}});
serwist.addEventListeners();
