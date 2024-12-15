export class ContactPerson {
    private contactPerson: string = '';
    private phoneNumber: string = '';
    private email: string = '';

    setContactPerson(value: string) {
        this.contactPerson = value;
        if (value === "") {
            return { ok: false, error: 'Поле не должно быть пустым!' };
        }
        return { ok: true, value: '' };
    }

    setPhoneNumber(value: string) {
        this.phoneNumber = value;
        if (value === "") {
            return { ok: false, error: 'Поле не должно быть пустым!' };
        }
        return { ok: true, value: '' };
    }

    setEmail(value: string) {
        this.email = value;
        if (value === "") {
            return { ok: false, error: 'Поле не должно быть пустым!' };
        }
        if (!this.email.includes('@')) {
            return { ok: false, error: 'Email не содержит @!' };
        }
        return { ok: true, value: '' };
    }

    getContactPerson(): string {
        return this.contactPerson;
    }

    getPhoneNumber(): string {
        return this.phoneNumber;
    }

    getEmail(): string {
        return this.email;
    }
}
