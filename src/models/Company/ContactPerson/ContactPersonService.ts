"use server";

import ContactPersonStorage from "@/models/Company/ContactPerson/ContactPersonStorage";
import {authAction} from "@/models/User/UserService";


export async function getContactPersonsByCompanyId(companyId: number) {
    return await ContactPersonStorage.getContactPersonsByCompanyId(companyId);
}

export async function createContactPerson(form: FormData) {
    return authAction(async () => {
        const contactPerson = form.get('contact_person');
        const phoneNumber = form.get('phone_number');
        const email = form.get('email');
        const companyId = form.get('company_id');

        if (contactPerson && phoneNumber && email && companyId) {
            return await ContactPersonStorage.createContactPerson(
                contactPerson as string,
                phoneNumber as string,
                email as string,
                Number.parseInt(companyId as string)
            );
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
