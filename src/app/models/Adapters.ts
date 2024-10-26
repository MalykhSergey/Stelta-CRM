import { dates_requests, file_names, Prisma, rebidding_prices, tenders } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { DatesRequests } from './DateRequest';
import FileName from './FileName';
import { RebiddingPrice } from './RebiddingPrice';
import { Tender } from './Tender';

export class TenderAdapter {
    static fromPrisma(data: any): Tender {
        const tender = new Tender();
        tender.id = data.id;
        tender.status = data.status;
        tender.company = data.company;
        tender.name = data.name;
        tender.regNumber = data.register_number;
        tender.lotNumber = data.lot_number;
        tender.initialMaxPrice = data.initial_max_price.toString();
        tender.price = data.price.toString();
        tender.date1_start = data.date1_start.toISOString();
        tender.date1_finish = data.date1_finish.toISOString();
        tender.date2_finish = data.date2_finish.toISOString();
        tender.contactPerson = data.contact_person;
        tender.phoneNumber = data.phone_number;
        tender.email = data.email;
        if ('rebidding_prices' in data) {
            tender.rebiddingPrices = data.rebidding_prices.map((r: { id: number; price: Prisma.Decimal; tender_id: number; } & { file_names: file_names[]; }) => RebiddingPriceAdapter.fromPrisma(r));
            tender.datesRequests = data.dates_requests.map((d: { id: number; date: Date; tender_id: number; } & { file_names: file_names[]; }) => DatesRequestsAdapter.fromPrisma(d));
            tender.fileNames = data.file_names.map((f: { id: number; name: string; }) => new FileName(f.id, f.name));
        }
        return tender;
    }

    static toPrisma(tender: Tender): Partial<tenders> {
        return {
            id: tender.id,
            status: tender.status,
            company: tender.company,
            name: tender.name,
            register_number: tender.regNumber,
            lot_number: tender.lotNumber,
            initial_max_price: new Decimal(tender.initialMaxPrice),
            price: new Decimal(tender.price),
            date1_start: new Date(tender.date1_start),
            date1_finish: new Date(tender.date1_finish),
            date2_finish: new Date(tender.date2_finish),
            contact_person: tender.contactPerson,
            phone_number: tender.phoneNumber,
            email: tender.email,
        };
    }
}

export class DatesRequestsAdapter {
    static fromPrisma(data: dates_requests & { file_names: file_names[] }): DatesRequests {
        return new DatesRequests(data.id, data.date.toISOString(), data.file_names.map(f => f.name));
    }

    static toPrisma(datesRequest: DatesRequests, tenderId: number): Partial<dates_requests> {
        return {
            id: datesRequest.id,
            date: new Date(datesRequest.date),
            tender_id: tenderId,
        };
    }
}

export class RebiddingPriceAdapter {

    static fromPrisma(data: rebidding_prices & { file_names: file_names[] }): RebiddingPrice {
        return new RebiddingPrice(data.id, parseFloat(data.price.toString()), data.file_names.map(f => f.name));
    }

    static toPrisma(rebiddingPrice: RebiddingPrice, tenderId: number): Partial<rebidding_prices> {
        return {
            id: rebiddingPrice.id,
            price: new Decimal(rebiddingPrice.price.toString()),
            tender_id: tenderId,
        };
    }
}
