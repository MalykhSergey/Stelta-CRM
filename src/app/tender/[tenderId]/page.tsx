import {Metadata} from "next";
import {getParentContracts, getTenderById} from "@/models/Tender/TenderService";
import {getCompaniesWithPersons} from "@/models/Company/CompanyService";
import {ConfirmDialogProvider} from "@/app/components/Dialog/ConfirmDialogContext";
import TenderPageClient from "./TenderPageClient";

export const metadata: Metadata = {
    title: 'Тендер',
}
type Params = Promise<{ tenderId: string }>

const TenderPageServer = async (props: { params: Params }) => {
    const tender = await getTenderById(Number.parseInt((await props.params).tenderId));
    const companies = await getCompaniesWithPersons();
    const parent_contracts = await getParentContracts();
    return <ConfirmDialogProvider><TenderPageClient tender={tender} companies={companies} parent_contacts={parent_contracts}/></ConfirmDialogProvider>;
};

export default TenderPageServer;
