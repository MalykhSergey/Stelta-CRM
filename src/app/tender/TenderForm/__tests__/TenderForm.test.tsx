import {afterEach, describe, expect, it, vi} from 'vitest';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import TenderForm from '../TenderForm';
import {Tender} from '@/models/Tender/Tender';
import Company from '@/models/Company/Company';
import {ContactPerson} from '@/models/Company/ContactPerson/ContactPerson';
import {makeAutoObservable} from 'mobx';
import TenderFlowService from '@/app/tender/[tenderId]/TenderFlowService';
import {TenderType} from '@/models/Tender/TenderType';
import {FundingType} from '@/models/Tender/FundingType';

// Мок для TenderFlowService
vi.mock('@/app/tender/[tenderId]/TenderFlowService', () => {
    return {
        default: vi.fn()
    };
});

describe('TenderForm', () => {
    const mockCompanies = [
        new Company(1, 'Компания 1'),
        new Company(2, 'Компания 2')
    ];

    const mockTender = new Tender();
    mockTender.id = 1;
    mockTender.name = 'Тестовый тендер';
    mockTender.company = mockCompanies[0];
    mockTender.status = 0;
    mockTender.type = TenderType.Tender;
    mockTender.fundingType = FundingType.Low;
    mockTender.contactPerson = new ContactPerson(1, 'Иван Иванов', '1234567890', 'test@test.com');
    makeAutoObservable(mockTender);

    // Создаем мок для TenderFlowService
    const mockTenderFlowService = {
        tender: mockTender,
        companies: mockCompanies,
        isEditable: () => ({
            status: true,
            type: true,
            fundingType: true,
            company: true,
            shortName: true,
            name: true,
            regNumber: true,
            lotNumber: true,
            initialMaxPrice: true,
            price: true,
            date1_start: true,
            date1_finish: true,
            date2_finish: true,
            date_finish: true,
            contactPerson: true
        }),
        changeType: vi.fn((type) => {
            mockTender.type = type;
        })
    };

    const setup = () => {
        // Устанавливаем мок для TenderFlowService
        (TenderFlowService as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => mockTenderFlowService);
        
        return render(
            <TenderForm
                tenderFlowService={mockTenderFlowService as unknown as TenderFlowService}
            />
        );
    };

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('должен отображать все поля формы', () => {
        setup();
        expect(screen.getByLabelText('Статус:')).toBeDefined();
        expect(screen.getByLabelText('Тип:')).toBeDefined();
        expect(screen.getByLabelText('Принадлежность:')).toBeDefined();
        expect(screen.getByLabelText('Организация:')).toBeDefined();
        expect(screen.getByLabelText('Полное наименование:')).toBeDefined();
        expect(screen.getByLabelText('НМЦК:')).toBeDefined();
        expect(screen.getByLabelText('Наша цена:')).toBeDefined();
        expect(screen.getByLabelText('Контактное лицо:')).toBeDefined();
        expect(screen.getByLabelText('Номер телефона:')).toBeDefined();
        expect(screen.getByLabelText('Электронная почта:')).toBeDefined();
    });

    it('должен корректно обновлять статус тендера', () => {
        setup();

        const statusSelect = screen.getByLabelText('Статус:') as HTMLSelectElement;
        fireEvent.change(statusSelect, {target: {value: '1'}});

        expect(mockTender.status).toBe(1);
    });

    it('должен корректно обновлять тип тендера', () => {
        setup();

        const typeSelect = screen.getByLabelText('Тип:') as HTMLSelectElement;
        fireEvent.change(typeSelect, {target: {value: '1'}});

        expect(mockTenderFlowService.changeType).toHaveBeenCalledWith(1);
    });

    it('должен корректно обновлять принадлежность тендера', () => {
        setup();

        const fundingTypeSelect = screen.getByLabelText('Принадлежность:') as HTMLSelectElement;
        fireEvent.change(fundingTypeSelect, {target: {value: '1'}});

        expect(mockTender.fundingType).toBe(1);
    });

    it('должен корректно обновлять организацию', () => {
        setup();

        const companySelect = screen.getByLabelText('Организация:') as HTMLSelectElement;
        fireEvent.change(companySelect, {target: {value: '2'}});

        expect(mockTender.company.id).toBe(2);
    });

    it('должен отображать ошибки валидации', () => {
        setup();

        const nameInput = screen.getByLabelText('Полное наименование:');
        fireEvent.change(nameInput, {target: {value: ''}});

        expect(screen.getByText('Поле не должно быть пустым!')).toBeDefined();
    });

    it('должен корректно обрабатывать ввод цен', () => {
        setup();

        const priceInput = screen.getByLabelText('Наша цена:') as HTMLInputElement;
        fireEvent.change(priceInput, {target: {value: '1000,50'}});

        expect(mockTender.price).toBe('1000.50');
    });

    it('должен корректно форматировать даты', () => {
        setup();

        const dateInput = screen.getByLabelText('Дата начала 1-го этапа:') as HTMLInputElement;
        const testDate = '2024-03-20T10:00';
        fireEvent.change(dateInput, {target: {value: testDate}});

        expect(mockTender.date1_start).toBe(testDate);
    });

    it('должен корректно обрабатывать ввод НМЦК', () => {
        setup();

        // Находим поле ввода НМЦК и симулируем изменение значения
        const initialMaxPriceInput = screen.getByLabelText('НМЦК:');
        // Используем onValueChange вместо onChange для CurrencyInput
        fireEvent.change(initialMaxPriceInput, {target: {value: '2000,75'}});
        
        // Проверяем, что значение в модели обновилось
        expect(mockTender.initialMaxPrice).toBe('2000.75');
    });
});
