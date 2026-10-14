import {useTranslations} from 'next-intl';
export default function Loading(){const t=useTranslations('browse');return <div className="skeleton" role="status" aria-label={t('loading')}/>;}
