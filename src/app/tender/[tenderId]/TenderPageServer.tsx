import { getTenderById } from '@/app/models/TenderService';
import TenderPageClientWrapper from './TenderPageClientWrapper';
import { getCompanies } from '@/app/models/CompanyService';


const TenderPageServer = async ({ params }: { params: { tenderId: string } }) => {
    const tender = await getTenderById(Number.parseInt(params.tenderId));
    const companies = await getCompanies();
    return <TenderPageClientWrapper tenderString={tender} companies={companies} />;
};

export default TenderPageServer;
