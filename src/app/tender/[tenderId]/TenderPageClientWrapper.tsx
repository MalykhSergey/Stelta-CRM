'use client';

import {ConfirmDialogProvider} from '@/app/components/Dialog/ConfirmDialogContext';
import Company from '@/models/Company/Company';
import {Tender} from '@/models/Tender/Tender';
import TenderPageClient from './TenderPageClient';

function TenderPageClientWrapper({tenderString, companies}: { tenderString: string, companies: Company[] }) {
    const tender = Tender.fromJSON(tenderString)
    return (<ConfirmDialogProvider><TenderPageClient tender={tender}
                                                     companies={companies}></TenderPageClient></ConfirmDialogProvider>)
}

export default TenderPageClientWrapper;
