"use server";

import logger from "@/config/Logger";
import { IContactPerson } from "@/models/Company/ContactPerson/ContactPerson";
import ContactPersonStorage from "@/models/Company/ContactPerson/ContactPersonStorage";
import { User } from "@/models/User/User";
import { authAction } from "@/models/User/UserService";

export async function getContactPersonById(id: number): Promise<IContactPerson | { error: string }> {
    return await ContactPersonStorage.getContactPersonById(id);
}

export async function getContactPersonsByCompanyId(companyId: number): Promise<IContactPerson[] | { error: string }> {
    return await ContactPersonStorage.getContactPersonsByCompanyId(companyId);
}

export async function createContactPerson(contactPerson: IContactPerson, companyId: number) {
    return authAction(async () => {
        return await ContactPersonStorage.createContactPerson(contactPerson, companyId);
    });
}

export async function updateContactPerson(form: FormData) {
    return authAction(async (user: User) => {
        const id = form.get('id');
        logger.info(`${user.name} update contact person ${id}`);
        const name = form.get('name');
        const phoneNumber = form.get('phone_number');
        const email = form.get('email');
        if (id && name && phoneNumber && email) {
            return await ContactPersonStorage.updateContactPerson(
                Number.parseInt(id as string),
                name as string,
                phoneNumber as string,
                email as string
            );
        } else
            return { error: 'Недостаточно полей!' };
    });
}

export async function deleteContactPerson(id: number) {
    return authAction(async (user: User) => {
        logger.info(`${user.name} delete contact person ${id}`);
        return await ContactPersonStorage.deleteContactPerson(id);
    });
}
