"use server"

import tenderStorage from "./TenderStorage";

export async function getAllTenders(): Promise<string> {
    return JSON.stringify(await tenderStorage.getAll());
}
export async function getTenderById(id: number): Promise<string> {
    return JSON.stringify(await tenderStorage.getById(id));
}
export async function addDateRequest(tenderId: number) {
    return tenderStorage.addDateRequest(tenderId)
}
export async function addRebiddingPrice(tenderId: number) {
    return tenderStorage.addRebiddingPrice(tenderId)
}
export async function deleteDateRequest(tenderId: number, rebiddingPriceId: number) {
    return tenderStorage.deleteDateRequest(tenderId, rebiddingPriceId)
}
export async function deleteRebiddingPrice(tenderId: number, rebiddingPriceId: number) {
    return tenderStorage.deleteRebiddingPrice(tenderId, rebiddingPriceId)
}
export async function updateTenderById(tender_string: string) {
    const tender = JSON.parse(tender_string)
    await tenderStorage.update(tender);
}