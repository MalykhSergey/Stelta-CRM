import {getTenderById} from '@/models/Tender/TenderService';
import TenderPageClientWrapper from './TenderPageClientWrapper';
import {getCompaniesWithPersons} from '@/models/Company/CompanyService';

type Params = Promise<{ tenderId: string }>

const TenderPageServer = async (props: { params: Params }) => {
    const tender = await getTenderById(Number.parseInt((await props.params).tenderId));
    const companies = await getCompaniesWithPersons();
    return <TenderPageClientWrapper tenderString={tender} companiesString={companies}/>;
};

export default TenderPageServer;
