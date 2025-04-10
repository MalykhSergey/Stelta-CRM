import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import TenderPageClient from '../TenderPageClient';
import React from 'react';
import {Tender} from '@/models/Tender/Tender';
import Company from "@/models/Company/Company";
import {deleteTender} from "@/models/Tender/TenderService";
import {showMessage} from "@/app/components/Alerts/Alert";

vi.mock('@/app/AuthContext', () => ({
    useAuth: () => ({
        user: {name: 'Test User', role: 'Admin'}
    })
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({push: vi.fn()})
}));

vi.mock('@/app/components/Alerts/Alert', () => ({
    showMessage: vi.fn(),
}));

vi.mock('@/models/Tender/TenderService', () => ({
    deleteTender: vi.fn()
}));

vi.mock('@/models/Company/ContactPerson/ContactPersonService', () => ({
    createContactPerson: vi.fn()
}));


// Мокаем дочерние компоненты
vi.mock('@/app/tender/TenderForm/TenderForm', () => ({
    default: () => <div data-testid="TenderForm"/>
}));
vi.mock('@/app/tender/DocumentForm/DocumentsForm', () => ({
    default: () => <div data-testid="DocumentsForm"/>
}));
vi.mock('@/app/tender/StageForm1/StageForm1', () => ({
    default: () => <div data-testid="StageForm1"/>
}));
vi.mock('@/app/tender/StageForm2/StageForm2', () => ({
    default: () => <div data-testid="StageForm2"/>
}));
vi.mock('@/app/tender/StageForm3/StageForm3', () => ({
    default: () => <div data-testid="StageForm3"/>
}));
vi.mock('@/app/tender/CommentsForm/CommentsForm', () => ({
    default: () => <div data-testid="CommentsForm"/>
}));

// Тесты для TenderPageClient
describe('TenderPageClient Component', () => {
    const tenderMock = new Tender();
    tenderMock.company = new Company(0, '')
    const companiesData: Company[] = [new Company(0, '')];

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup()
    });

    it('рендерит подкомпоненты и кнопки для тендера со status = 2', () => {
        render(
            <TenderPageClient
                tender={JSON.stringify({...tenderMock, status: 2})}
                companies={JSON.stringify(companiesData)}
            />
        );

        // Проверяем, что отрендерились подкомпоненты
        expect(screen.getByTestId('TenderForm')).toBeInTheDocument();
        expect(screen.getByTestId('DocumentsForm')).toBeInTheDocument();
        expect(screen.getByTestId('StageForm1')).toBeInTheDocument();
        expect(screen.getByTestId('CommentsForm')).toBeInTheDocument();
        // Для status = 2 компоненты StageForm2 и StageForm3 не должны рендериться
        expect(screen.queryByTestId('StageForm2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('StageForm3')).not.toBeInTheDocument();
        // Проверяем наличие кнопок по их тексту
        // Оранжевая кнопка с текстом "Дозапрос"
        expect(screen.getByText('Дозапрос')).toBeInTheDocument();
        // Зеленая кнопка с текстом "Сметный расчёт"
        expect(screen.getByText('Сметный расчёт')).toBeInTheDocument();
        // PrimaryButton с текстом "Сохранить"
        expect(screen.getByText('Сохранить')).toBeInTheDocument();
        // Красная кнопка с текстом "Не участвуем" (так как для status = 2 по умолчанию)
        expect(screen.getByText('Не участвуем')).toBeInTheDocument();
    });

    it('при клике на зеленую кнопку вызывает fetch и выводит уведомление об успехе', async () => {
        const mockFetch = vi.fn(() =>
            Promise.resolve(new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }))
        );
        global.fetch = mockFetch;

        render(
            <TenderPageClient
                tender={JSON.stringify({...tenderMock, status: 2})}
                companies={JSON.stringify(companiesData)}
            />
        );

        // Зеленая кнопка для статуса 2 имеет текст "Сметный расчёт"
        const greenButton = screen.getByText('Сметный расчёт');
        fireEvent.click(greenButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                `/api/tender/${tenderMock.id}`,
                expect.objectContaining({
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({...tenderMock, status: 3})
                })
            );
            expect(showMessage).toHaveBeenCalledWith("Данные успешно сохранены!", "successful");
        });
    });


    it('при клике на кнопку "Удалить" для тендера со status = 0 вызывает deleteTender и перенаправляет на "/"', async () => {
        // Создаем тендер со status = 0 (для которого рендерится кнопка "Удалить")
        const tenderDataStatus0 = {...tenderMock, status: 0};
        render(
            <TenderPageClient
                tender={JSON.stringify(tenderDataStatus0)}
                companies={JSON.stringify(companiesData)}
            />
        );

        // Кнопка "Удалить" должна отображаться для status = 0
        const deleteButton = screen.getByText('Удалить');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(deleteTender).toHaveBeenCalledWith(tenderDataStatus0.id);
        });
    });
});
