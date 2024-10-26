"use server"

import tenderStorage from "./TenderStorage";

export async function getAllTenders(): Promise<string> {
    return JSON.stringify(await tenderStorage.getAll());
}

export async function getTenderById(id: number): Promise<string> {
    return JSON.stringify(await tenderStorage.getById(id));
}