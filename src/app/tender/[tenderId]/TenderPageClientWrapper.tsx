'use client';

import {ConfirmDialogProvider} from '@/app/components/Dialog/ConfirmDialogContext';
import Company from '@/models/Company/Company';
import {Tender} from '@/models/Tender/Tender';
import TenderPageClient from './TenderPageClient';

function TenderPageClientWrapper({tenderString, companiesString}: { tenderString: string, companiesString: string }) {
    const tender = Tender.fromJSON(tenderString)
    const companies =Company.fromJSONArray(companiesString)
    tender.company = companies.find(company => company.id === tender.company.id)!
    return (<ConfirmDialogProvider><TenderPageClient tender={tender} companies={companies}/></ConfirmDialogProvider>)
}

export default TenderPageClientWrapper;
