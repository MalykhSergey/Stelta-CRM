import {getTenderById} from '@/models/Tender/TenderService';
import TenderPageClientWrapper from './TenderPageClientWrapper';
import {getCompanies} from '@/models/Company/CompanyService';

type Params = Promise<{ tenderId: string }>

const TenderPageServer = async (props:{params:Params}) => {
    const tender = await getTenderById(Number.parseInt((await props.params).tenderId));
    const companies = await getCompanies();
    return <TenderPageClientWrapper tenderString={tender} companies={companies}/>;
};

export default TenderPageServer;
