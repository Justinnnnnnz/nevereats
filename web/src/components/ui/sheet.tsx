"use client";
import * as Dialog from '@radix-ui/react-dialog';
import {useTranslations} from 'next-intl';
export function Sheet({open,onOpenChange,title,children}:{open:boolean;onOpenChange:(v:boolean)=>void;title:string;children:React.ReactNode}){
 const t=useTranslations('browse');
 return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="sheet-overlay"/><Dialog.Content className="sheet-content" aria-describedby={undefined}><div className="sheet-heading"><Dialog.Title>{title}</Dialog.Title><Dialog.Close aria-label={t('close')}>×</Dialog.Close></div>{children}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}
