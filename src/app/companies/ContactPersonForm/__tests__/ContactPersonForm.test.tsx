import Company from '@/models/Company/Company';
import {ContactPerson} from '@/models/Company/ContactPerson/ContactPerson';
import {deleteContactPerson, updateContactPerson} from '@/models/Company/ContactPerson/ContactPersonService';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {makeAutoObservable} from 'mobx';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {ContactPersonForm} from '../ContactPersonForm';

vi.mock('@/models/Company/ContactPerson/ContactPersonService', () => ({
    updateContactPerson: vi.fn(),
    deleteContactPerson: vi.fn(),
}));

vi.mock('@/app/components/Alerts/Alert', () => ({
    showMessage: vi.fn(),
}));

describe('ContactPersonForm', () => {
    const mockCompany = makeAutoObservable(new Company(1, 'Тестовая Компания'));
    const mockContactPerson = makeAutoObservable(new ContactPerson(1, 'Иван Иванов', '1234567890', 'ivan@example.com'));
    const mockErrors = {
        'ContactPersonName1': 'Имя обязательно',
        'phoneNumber1': 'Номер телефона некорректен',
        'email1': 'Некорректный email',
    };

    const setup = (isEditable = true, errors = {}) => {
        render(
            <ContactPersonForm
                company={mockCompany}
                contactPerson={mockContactPerson}
                isEditable={isEditable}
                errors={errors}
            />
        );
    };

    afterEach(() => {
        cleanup();
    });

    it('должен отображать все поля формы', () => {
        setup();
        expect(screen.getByLabelText('Контактное лицо:')).toBeDefined();
        expect(screen.getByLabelText('Номер телефона:')).toBeDefined();
        expect(screen.getByLabelText('Электронная почта:')).toBeDefined();
    });


    it('должен отображать ошибки валидации', () => {
        setup(true, mockErrors);

        expect(screen.getByText('Имя обязательно')).toBeDefined();
        expect(screen.getByText('Номер телефона некорректен')).toBeDefined();
        expect(screen.getByText('Некорректный email')).toBeDefined();
    });

    it('должен быть недоступным для редактирования, когда isEditable=false', () => {
        setup(false);

        const phoneInput = screen.getByLabelText('Номер телефона:') as HTMLInputElement;
        const emailInput = screen.getByLabelText('Электронная почта:') as HTMLInputElement;

        expect(phoneInput.disabled).toBe(true);
        expect(emailInput.disabled).toBe(true);
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('должен обновлять значения полей при вводе', () => {
        setup();

        const nameInput = screen.getByLabelText('Контактное лицо:') as HTMLInputElement;
        const phoneInput = screen.getByLabelText('Номер телефона:') as HTMLInputElement;
        const emailInput = screen.getByLabelText('Электронная почта:') as HTMLInputElement;

        fireEvent.change(nameInput, {target: {value: 'Новое Имя'}});
        fireEvent.change(phoneInput, {target: {value: '1111111111'}});
        fireEvent.change(emailInput, {target: {value: 'new@example.com'}});

        expect(nameInput.value).toBe('Новое Имя');
        expect(phoneInput.value).toBe('1111111111');
        expect(emailInput.value).toBe('new@example.com');
    });

    it('должен отображать выпадающий список при фокусе на поле имени', () => {
        const mockCompanyWithContacts = new Company(1, 'Тестовая Компания');
        mockCompanyWithContacts.contactPersons = [
            new ContactPerson(1, 'Иван Иванов', '1234567890', 'ivan@example.com'),
            new ContactPerson(2, 'Петр Петров', '9876543210', 'petr@example.com')
        ];

        render(
            <ContactPersonForm
                company={mockCompanyWithContacts}
                contactPerson={new ContactPerson(0, '', '', '')}
                isEditable={true}
                errors={{}}
            />
        );

        const nameInput = screen.getByLabelText('Контактное лицо:');
        fireEvent.focus(nameInput);

        const searchList = document.querySelector('#searchList');
        expect(searchList).toBeDefined();
        expect(screen.getByText('Иван Иванов')).toBeDefined();
        expect(screen.getByText('Петр Петров')).toBeDefined();
    });

    it('должен фильтровать список при вводе текста', () => {
        const mockCompanyWithContacts = new Company(1, 'Тестовая Компания');
        mockCompanyWithContacts.contactPersons = [
            new ContactPerson(1, 'Иван Иванов', '1234567890', 'ivan@example.com'),
            new ContactPerson(2, 'Петр Петров', '9876543210', 'petr@example.com')
        ];

        render(
            <ContactPersonForm
                company={mockCompanyWithContacts}
                contactPerson={new ContactPerson(0, 'Иван', '', '')}
                isEditable={true}
                errors={{}}
            />
        );

        const nameInput = screen.getByLabelText('Контактное лицо:');
        fireEvent.change(nameInput, {target: {value: 'Иван'}});

        expect(screen.getByText('Иван Иванов')).toBeDefined();
        expect(screen.queryByText('Петр Петров')).toBeNull();
    });

    it('должен заполнять все поля при выборе контакта из списка', () => {
        const mockCompanyWithContacts = new Company(1, 'Тестовая Компания');
        mockCompanyWithContacts.contactPersons = [
            new ContactPerson(1, 'Иван Иванов', '1234567890', 'ivan@example.com'),
        ];

        render(
            <ContactPersonForm
                company={mockCompanyWithContacts}
                contactPerson={makeAutoObservable(new ContactPerson(0, '', '', ''))}
                isEditable={true}
                errors={{}}
            />
        );

        const nameInput = screen.getByLabelText('Контактное лицо:') as HTMLInputElement;
        fireEvent.focus(nameInput);

        const searchItem = screen.getByText('Иван Иванов');
        fireEvent.click(searchItem);

        expect(nameInput.value).toBe('Иван Иванов');
        expect((screen.getByLabelText('Номер телефона:') as HTMLInputElement).value).toBe('1234567890');
        expect((screen.getByLabelText('Электронная почта:') as HTMLInputElement).value).toBe('ivan@example.com');
    });

    it('должен сохранять новое контактное лицо и добавлять его в список поиска', async () => {
        const mockCompanyWithContacts = makeAutoObservable(new Company(1, 'Тестовая Компания'));
        mockCompanyWithContacts.contactPersons = [
            makeAutoObservable(new ContactPerson(1, 'Иван Иванов', '1234567890', 'ivan@example.com'))
        ];

        const newContactPerson = makeAutoObservable(new ContactPerson(1, 'Петр Петров', '9876543210', 'petr@example.com'));

        render(
            <ContactPersonForm
                company={mockCompanyWithContacts}
                contactPerson={newContactPerson}
                isEditable={true}
                errors={{}}
            />
        );

        
        const saveButton = screen.getByText('Сохранить');
        expect(saveButton).toBeDefined();

        
        vi.mocked(updateContactPerson)

        
        fireEvent.click(saveButton);

        
        await waitFor(() => {
            expect(updateContactPerson).toHaveBeenCalled();
        });

        
        const nameInput = screen.getByLabelText('Контактное лицо:');
        fireEvent.focus(nameInput);

        expect(screen.getByText('Петр Петров')).toBeDefined();
    });

    it('должен удалять контактное лицо и убирать его из списка поиска', async () => {
        const mockCompanyWithContacts = makeAutoObservable(new Company(1, 'Тестовая Компания'));
        const existingContact = makeAutoObservable(new ContactPerson(1, 'Иван Иванов', '1234567890', 'ivan@example.com'));
        mockCompanyWithContacts.contactPersons = [existingContact];

        render(
            <ContactPersonForm
                company={mockCompanyWithContacts}
                contactPerson={existingContact}
                isEditable={true}
                errors={{}}
            />
        );

        
        const deleteButton = screen.getByText('Удалить');
        expect(deleteButton).toBeDefined();

        
        vi.mocked(deleteContactPerson).mockResolvedValueOnce(undefined);

        
        fireEvent.click(deleteButton);

        
        await waitFor(() => {
            expect(deleteContactPerson).toHaveBeenCalledWith(1);
        });

        
        expect((screen.getByLabelText('Контактное лицо:') as HTMLInputElement).value).toBe('');
        expect((screen.getByLabelText('Номер телефона:') as HTMLInputElement).value).toBe('');
        expect((screen.getByLabelText('Электронная почта:') as HTMLInputElement).value).toBe('');

        
        const nameInput = screen.getByLabelText('Контактное лицо:');
        fireEvent.focus(nameInput);

        expect(screen.queryByText('Иван Иванов')).toBeNull();
    });

    it('должен обрабатывать ошибки при сохранении контактного лица', async () => {
        const mockCompanyWithContacts = new Company(1, 'Тестовая Компания');
        const newContactPerson = makeAutoObservable(new ContactPerson(0, 'Новый Контакт', '1234567890', 'new@example.com'));

        render(
            <ContactPersonForm
                company={mockCompanyWithContacts}
                contactPerson={newContactPerson}
                isEditable={true}
                errors={{}}
            />
        );

        
        vi.mocked(updateContactPerson).mockResolvedValueOnce({ error: 'Ошибка сохранения' });

        
        const saveButton = screen.queryByText('Сохранить');
        
        await waitFor(() => {
            expect(saveButton).toBeNull();
        });
    });
});