import Link from 'next/link';
import {useTranslations} from 'next-intl';
export default function NotFound(){const t=useTranslations('polish');return <><h1>{t('notFound')}</h1><Link href="/">{t('home')}</Link></>;}
