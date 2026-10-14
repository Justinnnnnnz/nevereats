import type {MetadataRoute} from 'next';
import messages from '@/messages/zh-CN.json';
export default function manifest():MetadataRoute.Manifest{return {name:messages.brand.name,short_name:messages.brand.name,description:messages.brand.tagline,start_url:'/',display:'standalone',lang:'zh-CN',background_color:'#FFF4E6',theme_color:'#FF7A1A',icons:[{src:'/icons/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'/icons/icon-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]};}
