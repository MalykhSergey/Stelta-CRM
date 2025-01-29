"use server"

import tenderStorage from "./TenderStorage";
import {authAction} from "../User/UserService";
import {CalendarService} from "@/models/Tender/Calendar/CalendarService";
import {User} from "@/models/User/User";
import logger from "@/config/Logger";
import {Tender} from "@/models/Tender/Tender";

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
        CalendarService.deleteTenderEvents(tenderId);
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
        return tenderStorage.deleteDocumentRequest(tenderId, documentRequestId)
    })
}

export async function deleteRebiddingPriceById(tenderId: number, rebiddingPriceId: number) {
    return authAction(async (user: User) => {
        logger.info(`${user.name} delete rebidding price`);
        return tenderStorage.deleteRebiddingPrice(tenderId, rebiddingPriceId)
    })
}

export async function updateTenderById(tender_string: string) {
    return authAction(async (user: User) => {
        const tender = JSON.parse(tender_string) as Tender
        logger.info(`${user.name} updates tender ${tender.id}`);
        CalendarService.handleTenderEvents(tender);
        return await tenderStorage.update(tender);
    })
}