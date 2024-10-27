import { getTenderById } from '@/app/models/TenderService';
import TenderPageClient from './TenderPageClient';


const TenderPageServer = async ({ params }: { params: { tenderId: string } }) => {
    const tender = await getTenderById(Number.parseInt(params.tenderId));
    return <TenderPageClient tenderString={tender} />;
};

export default TenderPageServer;
