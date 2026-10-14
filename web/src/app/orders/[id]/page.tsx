import {OrderPreview} from '@/components/order-preview';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <OrderPreview id={id}/>;}
