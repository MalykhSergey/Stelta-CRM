import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import TenderForm from '../TenderForm';
import { Tender } from '@/models/Tender/Tender';
import Company from '@/models/Company/Company';
import { ContactPerson } from '@/models/Company/ContactPerson/ContactPerson';
import { makeAutoObservable } from 'mobx';

describe('TenderForm', () => {
    const mockCompanies = [
        new Company(1, 'Компания 1'),
        new Company(2, 'Компания 2')
    ];

    const mockTender = new Tender();
    mockTender.id = 1;
    mockTender.name = 'Тестовый тендер';
    mockTender.company = mockCompanies[0];
    mockTender.contactPerson = new ContactPerson(1, 'Иван Иванов', '1234567890', 'test@test.com');
    makeAutoObservable(mockTender)

    const mockIsEditable = {
        status: true,
        isSpecial: true,
        company: true,
        name: true,
        regNumber: true,
        lotNumber: true,
        initialMaxPrice: true,
        price: true,
        date1_start: true,
        date1_finish: true,
        date2_finish: true,
        date_finish: true,
        contactPerson: true,
        phoneNumber: true,
        email: true
    };

    const setup = (isEditable = mockIsEditable) => {
        return render(
            <TenderForm
                tender={mockTender}
                companies={mockCompanies}
                isEditable={isEditable}
            />
        );
    };

    afterEach(() => {
        cleanup();
        // vi.clearAllMocks();
    });

    it('должен отображать все поля формы', () => {
        setup();
        
        expect(screen.getByLabelText('Статус:')).toBeDefined();
        expect(screen.getByLabelText('Подыгрыш:')).toBeDefined();
        expect(screen.getByLabelText('Организация:')).toBeDefined();
        expect(screen.getByLabelText('Полное наименование:')).toBeDefined();
        expect(screen.getByLabelText('НМЦК:')).toBeDefined();
        expect(screen.getByLabelText('Наша цена:')).toBeDefined();
    });

    it('должен корректно обновлять статус тендера', () => {
        setup();
        
        const statusSelect = screen.getByLabelText('Статус:') as HTMLSelectElement;
        fireEvent.change(statusSelect, { target: { value: '1' } });
        
        expect(mockTender.status).toBe(1);
    });

    it('должен корректно обновлять чекбокс "Подыгрыш"', () => {
        setup();
        
        const specialCheckbox = screen.getByLabelText('Подыгрыш:') as HTMLInputElement;
        fireEvent.click(specialCheckbox);
        
        expect(mockTender.isSpecial).toBe(true);
    });

    it('должен корректно обновлять организацию', () => {
        setup();
        
        const companySelect = screen.getByLabelText('Организация:') as HTMLSelectElement;
        fireEvent.change(companySelect, { target: { value: '2' } });
        
        expect(mockTender.company.id).toBe(2);
    });

    // it('должен быть недоступным для редактирования при isEditable=false', () => {
    //     const nonEditableProps = Object.keys(mockIsEditable).reduce((acc, key) => ({
    //         ...acc,
    //         [key]: false
    //     }), {});
        
    //     setup(nonEditableProps);
        
    //     const inputs = screen.getAllByRole('textbox');
    //     inputs.forEach(input => {
    //         expect(input).toBeDisabled();
    //     });
    // });

    it('должен отображать ошибки валидации', () => {
        setup();
        
        const nameInput = screen.getByLabelText('Полное наименование:');
        fireEvent.change(nameInput, { target: { value: '' } });
        
        expect(screen.getByText('Поле не должно быть пустым!')).toBeDefined();
    });

    it('должен корректно обрабатывать ввод цен', () => {
        setup();
        
        const priceInput = screen.getByLabelText('Наша цена:') as HTMLInputElement;
        fireEvent.change(priceInput, { target: { value: '1000,50' } });
        
        expect(mockTender.price).toBe('1000.50');
    });

    it('должен корректно форматировать даты', () => {
        setup();
        
        const dateInput = screen.getByLabelText('Дата начала 1-го этапа:') as HTMLInputElement;
        const testDate = '2024-03-20T10:00';
        fireEvent.change(dateInput, { target: { value: testDate } });
        
        expect(mockTender.date1_start).toBe(testDate);
    });
}); 