"use server";

import ContactPersonStorage from "@/models/Company/ContactPerson/ContactPersonStorage";
import {authAction} from "@/models/User/UserService";
import {ContactPerson, IContactPerson} from "@/models/Company/ContactPerson/ContactPerson";
import logger from "@/config/Logger";
import {User} from "@/models/User/User";

export async function getContactPersonById(id: number): Promise<IContactPerson | { error: string }> {
    return await ContactPersonStorage.getContactPersonById(id);
}

export async function getContactPersonsByCompanyId(companyId: number): Promise<IContactPerson[] | { error: string }> {
    return await ContactPersonStorage.getContactPersonsByCompanyId(companyId);
}

export async function createContactPerson(form: FormData) {
    return authAction(async (user:User) => {
        const name = form.get('name');
        const phoneNumber = form.get('phone_number');
        const email = form.get('email');
        const companyId = form.get('company_id');
        logger.info(`${user.name} create contact person ${name} in ${companyId}`);
        if (name && phoneNumber && email && companyId) {
            return await ContactPersonStorage.createContactPerson(
                new ContactPerson(0, name as string, phoneNumber as string, email as string),
                Number.parseInt(companyId as string)
            );
        } else {
            return {error: 'Недостаточно полей!'};
        }
    });
}

export async function updateContactPerson(form: FormData) {
    return authAction(async (user:User) => {
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
            return {error: 'Недостаточно полей!'};
    });
}

export async function deleteContactPerson(id: number) {
    return authAction(async (user:User) => {
        logger.info(`${user.name} delete contact person ${id}`);
        return await ContactPersonStorage.deleteContactPerson(id);
    });
}
