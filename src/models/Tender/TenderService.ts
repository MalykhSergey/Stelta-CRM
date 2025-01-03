"use server"

import tenderStorage from "./TenderStorage";
import {authAction} from "../User/UserService";
import {CalendarService} from "@/models/Tender/Calendar/CalendarService";

export async function createTender(status: number) {
    return authAction(
        async () => {
            return await tenderStorage.createTender(status)
        }
    )
}

export async function deleteTender(tenderId: number) {
    return authAction(async () => {
        return tenderStorage.deleteTender(tenderId)
    })
}

export async function getAllTenders(): Promise<string> {
    return JSON.stringify(await tenderStorage.getAll());
}

export async function getTenderById(id: number): Promise<string> {
    return JSON.stringify(await tenderStorage.getById(id));
}

export async function addDocumentRequest(tenderId: number) {
    return authAction(async () => {
        return tenderStorage.addDocumentRequest(tenderId)
    })
}

export async function addRebiddingPrice(tenderId: number) {
    return authAction(async () => {
        return tenderStorage.addRebiddingPrice(tenderId)
    })
}

export async function deleteDocumentRequestById(tenderId: number, documentRequestId: number) {
    return authAction(async () => {
        return tenderStorage.deleteDocumentRequest(tenderId, documentRequestId)
    })
}

export async function deleteRebiddingPriceById(tenderId: number, rebiddingPriceId: number) {
    return authAction(async () => {
        return tenderStorage.deleteRebiddingPrice(tenderId, rebiddingPriceId)
    })
}

export async function updateTenderById(tender_string: string) {
    return authAction(async () => {
        const tender = JSON.parse(tender_string)
        CalendarService.handleTenderEvents(tender);
        return await tenderStorage.update(tender);
    })
}