"use server"

import logger from "@/config/Logger";
import { CalendarService } from "@/models/Tender/Calendar/CalendarService";
import ParentContract from "@/models/Tender/ParentContract";
import { Tender } from "@/models/Tender/Tender";
import { User } from "@/models/User/User";
import { authAction } from "../User/UserService";
import tenderStorage from "./TenderStorage";

export async function createTender(status: number) {
    return authAction(async (user: User) => {
        logger.info(`${user.name} create tender`);
        return await tenderStorage.createTender(status)
    }
    )
}

export async function deleteTender(tenderId: number) {
    return authAction(async (user: User) => {
        logger.info(`${user.name} delete tender ${tenderId}`);
        const result = await tenderStorage.deleteTender(tenderId);
        if (!result?.error)
            CalendarService.deleteTenderEvents(tenderId);
        return result
    })
}

export async function getAllTenders(): Promise<string> {
    return JSON.stringify(await tenderStorage.getAll());
}

export async function getTenderById(id: number): Promise<string> {
    return JSON.stringify(await tenderStorage.getById(id));
}

export async function getParentContracts(): Promise<ParentContract[]> {
    return tenderStorage.getParentContracts();
}

export async function addDocumentRequest(tenderId: number) {
    return authAction(async (user: User) => {
        logger.info(`${user.name} add document request`);
        return tenderStorage.addDocumentRequest(tenderId)
    })
}

export async function addRebiddingPrice(tenderId: number) {
    return authAction(async (user: User) => {
        logger.info(`${user.name} add rebidding price`);
        return tenderStorage.addRebiddingPrice(tenderId)
    })
}

export async function deleteDocumentRequestById(tenderId: number, documentRequestId: number) {
    return authAction(async (user: User) => {
        logger.info(`${user.name} delete document request`);
        const result = await tenderStorage.deleteDocumentRequest(tenderId, documentRequestId);
        if (!result?.error)
            CalendarService.deleteDocumentRequest(documentRequestId)
        return result
    })
}

export async function deleteRebiddingPriceById(tenderId: number, rebiddingPriceId: number) {
    return authAction(async (user: User) => {
        logger.info(`${user.name} delete rebidding price`);
        return tenderStorage.deleteRebiddingPrice(tenderId, rebiddingPriceId)
    })
}

export async function updateTenderById(tender: Tender) {
    return authAction(async (user: User) => {
        logger.info(`${user.name} updates tender ${tender.id}`);
        CalendarService.handleTenderEvents(tender);
        return await tenderStorage.update(tender);
    })
}

export async function search_tenders(status: number | null, type: number | null, funding_type: number | null, name: string, reg_number: string, company_name: string, startDate: string, endDate: string, page: number): Promise<{ remained: boolean, tenders: Tender[] }> {
    return tenderStorage.searchTenders(status, type, funding_type, name, reg_number, company_name, startDate, endDate, page);
}