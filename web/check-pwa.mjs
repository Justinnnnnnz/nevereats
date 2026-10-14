import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chromium'});
try{
 const context=await browser.newContext({viewport:{width:375,height:812}});
 const page=await context.newPage();
 await page.goto('http://localhost:3002');
 const manifest=await (await page.request.get('http://localhost:3002/manifest.webmanifest')).json();
 assert.equal(manifest.display,'standalone');assert.equal(manifest.icons.length,2);
 await page.getByRole('button',{name:'📚 Robarts 图书馆',exact:true}).click();
 await page.getByRole('heading',{name:'附近热门',exact:true}).waitFor();
 for(const width of [375,430]){await page.setViewportSize({width,height:812});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`.cache.nosync/home-${width}.png`});}
 await page.evaluate(async()=>{const registration=await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(new Error("Service worker timeout")),30000))]);if(!registration.active)throw new Error('Service worker not active');});
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await context.setOffline(true);
 await page.goto('http://localhost:3002/unvisited-offline-route');
 await page.getByRole('heading',{name:'快乐还在，网络暂时不在'}).waitFor();
 console.log('PWA manifest, active service worker, offline fallback, 375px and 430px passed');
 await context.close();
}finally{await browser.close();}
