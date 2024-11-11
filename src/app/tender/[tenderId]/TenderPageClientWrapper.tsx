'use client';

import { ConfirmDialogProvider } from '@/app/components/Dialog/ConfirmDialogContext';
import { Tender } from '@/app/models/Tender';
import TenderPageClient from './TenderPageClient';

function TenderPageClientWrapper({ tenderString, companiesString }: { tenderString: string, companiesString:string }) {
    const tender = Tender.fromJSON(tenderString)
    const companies = JSON.parse(companiesString)
    return (<ConfirmDialogProvider><TenderPageClient tender={tender} companies={companies}></TenderPageClient></ConfirmDialogProvider>)
};

export default TenderPageClientWrapper;
