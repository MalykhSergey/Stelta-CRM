import { getCompanies, getTenderById } from '@/app/models/TenderService';
import TenderPageClientWrapper from './TenderPageClientWrapper';


const TenderPageServer = async ({ params }: { params: { tenderId: string } }) => {
    const tender = await getTenderById(Number.parseInt(params.tenderId));
    const companies = await getCompanies();
    return <TenderPageClientWrapper tenderString={tender} companiesString={companies} />;
};

export default TenderPageServer;
