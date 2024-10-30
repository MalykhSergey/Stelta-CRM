'use client';

import { ConfirmDialogProvider } from '@/app/components/Dialog/ConfirmDialogContext';
import { Tender } from '@/app/models/Tender';
import TenderPageClient from './TenderPageClient';

function TenderPageClientWrapper({ tenderString }: { tenderString: string }) {
    const tender = Tender.fromJSON(tenderString)
    return (<ConfirmDialogProvider><TenderPageClient tender={tender}></TenderPageClient></ConfirmDialogProvider>)
};

export default TenderPageClientWrapper;
