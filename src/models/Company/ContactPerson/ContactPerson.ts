export class ContactPerson {
    email: string = '';
    name: string = '';
    phoneNumber: string = '';
    id: number = 0;

    constructor(id: number, name: string, phoneNumber: string, email: string) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }

    setName(value: string) {
        this.name = value;
        if (value === "") {
            return {ok: false, error: 'Поле не должно быть пустым!'};
        }
        return {ok: true, value: ''};
    }

    setPhoneNumber(value: string) {
        this.phoneNumber = value;
        if (value === "") {
            return {ok: false, error: 'Поле не должно быть пустым!'};
        }
        return {ok: true, value: ''};
    }

    setEmail(value: string) {
        this.email = value;
        if (value === "") {
            return {ok: false, error: 'Поле не должно быть пустым!'};
        }
        if (!this.email.includes('@')) {
            return {ok: false, error: 'Email не содержит @!'};
        }
        return {ok: true, value: ''};
    }


    isEquals(contactPerson: ContactPerson): boolean {
        if (contactPerson.name != this.name) return false
        if (contactPerson.phoneNumber != this.phoneNumber) return false
        if (contactPerson.email != this.email) return false
        return true
    }
}
