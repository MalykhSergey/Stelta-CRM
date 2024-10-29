'use client';

import { Tender } from '@/app/models/Tender';
import TenderPageClient from './TenderPageClient';

function TenderPageClientWrapper({ tenderString }: { tenderString: string }) {
    const tender = Tender.fromJSON(tenderString)
    return (<TenderPageClient tender={tender}></TenderPageClient>)
};

export default TenderPageClientWrapper;
