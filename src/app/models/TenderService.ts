"use server"

import tenderStorage from "./TenderStorage";
import { authAction } from "./UserService";

export async function createTender() {
    return await tenderStorage.createTender()
}

export async function deleteTender(tenderId: number) {
    return authAction(async () => { return tenderStorage.deleteTender(tenderId) })
}
export async function getAllTenders(): Promise<string> {
    return JSON.stringify(await tenderStorage.getAll());
}
export async function getTenderById(id: number): Promise<string> {
    return JSON.stringify(await tenderStorage.getById(id));
}
export async function addDateRequest(tenderId: number) {
    return authAction(async () => { return tenderStorage.addDateRequest(tenderId) })
}
export async function addRebiddingPrice(tenderId: number) {
    return authAction(async () => { return tenderStorage.addRebiddingPrice(tenderId) })
}
export async function deleteDateRequestById(tenderId: number, dateRequestId: number) {
    return authAction(async () => { return tenderStorage.deleteDateRequest(tenderId, dateRequestId) })
}
export async function deleteRebiddingPriceById(tenderId: number, rebiddingPriceId: number) {
    return authAction(async () => { return tenderStorage.deleteRebiddingPrice(tenderId, rebiddingPriceId) })
}
export async function updateTenderById(tender_string: string) {
    return authAction(async () => {
        const tender = JSON.parse(tender_string)
        return await tenderStorage.update(tender);
    })
}