import { PrismaClient } from "@prisma/client";
import { TenderAdapter } from "./Adapters";
import { Tender } from "./Tender";

const prisma = new PrismaClient(
    // {log: ['query', 'info', 'warn', 'error']}
);
console.log('Prisma created')

class TenderStorage {
    constructor() { 
        console.log('Created Tender storage')
    }
    // add(tender: Tender) {
    //     // this.allTenders.push(tender)
    // }

    async getAll(): Promise<Tender[]> {
        const tenders = await prisma.tenders.findMany({
            include: {
                rebidding_prices: {
                    include: {
                        file_names: true,
                    },
                },
                dates_requests: {
                    include: {
                        file_names: true,
                    },
                },
                file_names: true
            }
        });
        return tenders.map(tender => TenderAdapter.fromPrisma(tender))
    }
    async getById(id: number): Promise<Tender> {
        return TenderAdapter.fromPrisma(await prisma.tenders.findUnique({
            where: { id: id }, include: {
                rebidding_prices: {
                    include: {
                        file_names: true,
                    },
                },
                dates_requests: {
                    include: {
                        file_names: true,
                    },
                },
                file_names: true
            }
        }))
    }
    async addFile(tenderId: number, fileName: string) {
        await prisma.file_names.create({ data: { tender_id: tenderId, name: fileName } });
    }
    async deleteFile(id: number) {
        await prisma.file_names.delete({ where: { id: id } });
    }

}
const tenderStorage = new TenderStorage();
export default tenderStorage;