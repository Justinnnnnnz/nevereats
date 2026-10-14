import Link from 'next/link';
import {useTranslations} from 'next-intl';
export default function Page(){const t=useTranslations('polish');return <><h1>{t('offlineTitle')}</h1><p>{t('offlineBody')}</p><Link href="/">{t('retry')}</Link></>;}
