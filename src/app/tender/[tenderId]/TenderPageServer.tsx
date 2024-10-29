import { getTenderById } from '@/app/models/TenderService';
import TenderPageClientWrapper from './TenderPageClientWrapper';


const TenderPageServer = async ({ params }: { params: { tenderId: string } }) => {
    const tender = await getTenderById(Number.parseInt(params.tenderId));
    return <TenderPageClientWrapper tenderString={tender} />;
};

export default TenderPageServer;
