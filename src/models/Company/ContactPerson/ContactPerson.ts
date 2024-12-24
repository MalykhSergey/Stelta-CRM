export class ContactPerson {
    constructor(id: number, name: string, phoneNumber: string, email: string) {
        this._id = id;
        this._name = name;
        this._phoneNumber = phoneNumber;
        this._email = email;
    }

    private _email: string = '';

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    private _name: string = '';

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    private _phoneNumber: string = '';

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    set phoneNumber(value: string) {
        this._phoneNumber = value;
    }

    private _id: number = 0;

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    setName(value: string) {
        this._name = value;
        if (value === "") {
            return {ok: false, error: 'Поле не должно быть пустым!'};
        }
        return {ok: true, value: ''};
    }

    setPhoneNumber(value: string) {
        this._phoneNumber = value;
        if (value === "") {
            return {ok: false, error: 'Поле не должно быть пустым!'};
        }
        return {ok: true, value: ''};
    }

    setEmail(value: string) {
        this._email = value;
        if (value === "") {
            return {ok: false, error: 'Поле не должно быть пустым!'};
        }
        if (!this._email.includes('@')) {
            return {ok: false, error: 'Email не содержит @!'};
        }
        return {ok: true, value: ''};
    }

    getName(): string {
        return this._name;
    }

    getPhoneNumber(): string {
        return this._phoneNumber;
    }

    getEmail(): string {
        return this._email;
    }

    isEquals(contactPerson: ContactPerson): boolean {
        if (contactPerson.getName() != this._name) return false
        if (contactPerson.getPhoneNumber() != this._phoneNumber) return false
        if (contactPerson.getEmail() != this._email) return false
        return true
    }
}
