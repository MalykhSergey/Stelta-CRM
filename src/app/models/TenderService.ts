"use server"

import tenderStorage from "./TenderStorage";

export async function createTender() {
    return await tenderStorage.createTender()
}

export async function deleteTender(tenderId: number) {
    return await tenderStorage.deleteTender(tenderId)
}
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
export async function deleteDateRequestById(tenderId: number, dateRequestId: number) {
    return tenderStorage.deleteDateRequest(tenderId, dateRequestId)
}
export async function deleteRebiddingPriceById(tenderId: number, rebiddingPriceId: number) {
    return tenderStorage.deleteRebiddingPrice(tenderId, rebiddingPriceId)
}
export async function updateTenderById(tender_string: string) {
    const tender = JSON.parse(tender_string)
    return await tenderStorage.update(tender);
}
export async function getCompanies() {
    return JSON.stringify(await tenderStorage.getCompanies());
}
export async function createCompany(name: string) {
    return await tenderStorage.createCompany(name);
}