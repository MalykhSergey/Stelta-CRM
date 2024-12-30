"use server";

import ContactPersonStorage from "@/models/Company/ContactPerson/ContactPersonStorage";
import {authAction} from "@/models/User/UserService";
import {ContactPerson, IContactPerson} from "@/models/Company/ContactPerson/ContactPerson";

export async function getContactPersonById(id: number): Promise<IContactPerson | {error: string}> {
    return await ContactPersonStorage.getContactPersonById(id);
}

export async function getContactPersonsByCompanyId(companyId: number): Promise<IContactPerson[] | {error: string}> {
    return await ContactPersonStorage.getContactPersonsByCompanyId(companyId);
}

export async function createContactPerson(form: FormData) {
    return authAction(async () => {
        const name = form.get('name');
        const phoneNumber = form.get('phone_number');
        const email = form.get('email');
        const companyId = form.get('company_id');
        if (name && phoneNumber && email && companyId) {
            return await ContactPersonStorage.createContactPerson(
                new ContactPerson(0, name as string, phoneNumber as string, email as string),
                Number.parseInt(companyId as string)
            );
        }else {
            return {error: 'Недостаточно полей!'};
        }
    });
}

export async function updateContactPerson(form: FormData) {
    return authAction(async () => {
        const id = form.get('id');
        const contactPerson = form.get('contact_person');
        const phoneNumber = form.get('phone_number');
        const email = form.get('email');
        if (id && contactPerson && phoneNumber && email) {
            return await ContactPersonStorage.updateContactPerson(
                Number.parseInt(id as string),
                contactPerson as string,
                phoneNumber as string,
                email as string
            );
        }
    });
}

export async function deleteContactPerson(id: number) {
    return authAction(async () => {
        return await ContactPersonStorage.deleteContactPerson(id);
    });
}
