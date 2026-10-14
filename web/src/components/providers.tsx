"use client";
import {useEffect,useState} from 'react';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {MotionConfig} from 'framer-motion';
import {useStore} from '@/lib/store';
export function Providers({children}:{children:React.ReactNode}){
 const [client]=useState(()=>new QueryClient({defaultOptions:{queries:{retry:1,staleTime:30000}}}));
 useEffect(()=>{void Promise.resolve(useStore.persist.rehydrate()).catch(()=>{}).then(()=>useStore.getState().initGuest());},[]);
 return <QueryClientProvider client={client}><MotionConfig reducedMotion="user">{children}</MotionConfig></QueryClientProvider>;
}
