import {useStore} from './store';
export async function api<T>(path:string,init?:RequestInit):Promise<T>{
 const response=await fetch(`${process.env.NEXT_PUBLIC_API_URL||'/v1'}${path}`,{...init,headers:{'Content-Type':'application/json','X-Guest-Id':useStore.getState().guestId,...init?.headers}});
 if(!response.ok)throw new Error('API request failed');
 return response.json();
}
