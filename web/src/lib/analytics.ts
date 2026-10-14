"use client";
type Event='app_opened'|'address_selected'|'restaurant_viewed'|'item_added'|'checkout_started'|'tip_selected'|'pretend_pay_completed'|'order_status_viewed'|'order_delivered_viewed'|'share_card_generated'|'share_card_shared'|'reorder_clicked';
// Explicit allowlist prevents address, coordinates, option names and URL/token leakage.
const allowed=new Set(['type','restaurant_id','menu_item_id','percentage','total_cents','status']);
let client:Promise<import('posthog-js').PostHog>|undefined;
export function track(event:Event,properties:Record<string,string|number>={}){
 if(typeof window==='undefined'||navigator.doNotTrack==='1'||!process.env.NEXT_PUBLIC_POSTHOG_KEY)return;
 client??=import('posthog-js').then(({default:posthog})=>{posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!,{api_host:process.env.NEXT_PUBLIC_POSTHOG_HOST||'https://us.i.posthog.com',autocapture:false,capture_pageview:false,capture_pageleave:false,disable_session_recording:true,persistence:'memory',respect_dnt:true});return posthog;});
 const safe=Object.fromEntries(Object.entries(properties).filter(([key])=>allowed.has(key)));
 void client.then(posthog=>posthog.capture(event,safe)).catch(()=>{});
}
export function initMonitoring(){
 if(typeof window==='undefined'||navigator.doNotTrack==='1'||!process.env.NEXT_PUBLIC_SENTRY_DSN)return;
 void import('@sentry/nextjs').then(Sentry=>Sentry.init({dsn:process.env.NEXT_PUBLIC_SENTRY_DSN,defaultIntegrations:false,integrations:[Sentry.globalHandlersIntegration()],maxBreadcrumbs:0,tracesSampleRate:0,replaysSessionSampleRate:0,replaysOnErrorSampleRate:0,beforeSend:event=>{delete event.request;delete event.user;delete event.extra;delete event.contexts;event.message='Client runtime error';event.breadcrumbs=[];if(event.exception)event.exception.values?.forEach(v=>{v.value='Client runtime error';v.stacktrace?.frames?.forEach(f=>{if(f.filename)f.filename=f.filename.split('?')[0];});});return event;}})).catch(()=>{});
}
