"use client";
import {motion} from 'framer-motion';
export default function Template({children}:{children:React.ReactNode}){return <motion.div initial={false} animate={{opacity:[.92,1],y:[4,0]}} transition={{duration:.18}}>{children}</motion.div>;}
