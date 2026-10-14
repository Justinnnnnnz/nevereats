"use client";
import Link from 'next/link';
import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {cartSubtotal,money,useStore} from '@/lib/store';
export function CartBar(){const cart=useStore(s=>s.cart);const t=useTranslations('browse');if(!cart.length)return null;return <motion.div initial={{x:"-50%",y:30,opacity:0}} animate={{x:"-50%",y:0,opacity:1}} className="cart-bar"><span>{t('cartCount',{count:cart.reduce((n,x)=>n+x.quantity,0)})} · {money(cartSubtotal(cart))}</span><Link href="/checkout">{t('checkout')} →</Link></motion.div>;}
