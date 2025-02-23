import React from 'react';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import StageForm2 from '../StageForm2';
import {Tender} from '@/models/Tender/Tender';
import {RebiddingPrice} from '@/models/Tender/RebiddingPrice';
import {addRebiddingPrice} from "@/models/Tender/TenderService";
import {mockDeep} from "vitest-mock-extended";

vi.mock('@/models/Tender/TenderService', () => ({
    addRebiddingPrice: vi.fn()
}));
vi.mock('@/app/tender/DocumentForm/DocumentsForm', () => ({
    default: ({title, stage}: { title: string; stage: number; }) => (
        <div data-testid={`documents-form-${stage}`}>{title}</div>
    )
}));
vi.mock('@/app/components/Buttons/ExpandButton/ExpandButton', () => ({
    ExpandButton: ({onClick, expanded,}: { onClick: () => void; expanded: boolean; }) => (
        <button data-testid="expand-button" onClick={onClick}>
            {expanded ? 'Collapse' : 'Expand'}
        </button>
    )
}));

describe('StageForm2', () => {
    const tenderId = 1;
    let fakeTender: Tender;

    beforeEach(() => {
        // Используем mockDeep для создания мок-объекта Tender
        fakeTender = mockDeep<Tender>({
            id: tenderId,
            price: '5000',
            rebiddingPrices: [],
            stagedFileNames: [[], [], [], [], [], [], []],
        });
        // Мокаем setPrice для возврата успешного результата
        fakeTender.setPrice = vi.fn().mockReturnValue({ok: true, error: ''});
        cleanup();
        vi.clearAllMocks();
    });

    it('отображает корректно StageForm2', () => {
        render(<StageForm2 tender={fakeTender as Tender} isEditable={true}/>);
        // Проверяем наличие заголовка
        expect(screen.getByText('Этап 2')).toBeInTheDocument();
        // Проверяем, что рендерятся документы и формы для 2 этапа
        expect(screen.getByTestId('documents-form-2')).toBeInTheDocument();
        expect(screen.getByTestId('documents-form-3')).toBeInTheDocument();
        // Проверяем наличие поля ввода "Наша цена:"
        const currencyInput = screen.getByLabelText(/Наша цена:/) as HTMLInputElement;
        expect(currencyInput).toBeInTheDocument();
        expect(currencyInput.value).toBe('5 000₽');
        // Кнопка "Переторжка" должна присутствовать при isEditable=true
        expect(screen.getByRole('button', {name: 'Переторжка'})).toBeInTheDocument();
    });

    it('вызывает setPrice при изменении значения цены', () => {
        render(<StageForm2 tender={fakeTender as Tender} isEditable={true}/>);
        const currencyInput = screen.getByLabelText(/Наша цена:/) as HTMLInputElement;
        fireEvent.change(currencyInput, {target: {value: '6000'}});
        expect(fakeTender.setPrice).toHaveBeenCalledWith('6000');
    });

    it('изменяет состояние кнопки при клике на ExpandButton', () => {
        render(<StageForm2 tender={fakeTender as Tender} isEditable={true}/>);

        // Изначально isEditable = true, значит collapsed.isTrue = true, поэтому ExpandButton получает expanded = false
        const expandButton = screen.getByTestId('expand-button');
        expect(expandButton).toHaveTextContent('Expand');

        // При клике вызывается toggle, и состояние меняется
        fireEvent.click(expandButton);
        expect(expandButton).toHaveTextContent('Collapse');
    });

    it('добавляет новую переторжку при клике на кнопку "Переторжка"', async () => {
        vi.mocked(addRebiddingPrice).mockResolvedValue(42);

        render(<StageForm2 tender={fakeTender as Tender} isEditable={true}/>);

        // В начале список переторжек пустой
        expect(fakeTender.rebiddingPrices).toHaveLength(0);

        // Находим и кликаем кнопку "Переторжка"
        const rebiddingButton = screen.getByRole('button', {name: 'Переторжка'});
        fireEvent.click(rebiddingButton);
        fireEvent.click(rebiddingButton);

        // Ожидаем обновления компонента после асинхронного вызова
        await waitFor(() => {
            expect(fakeTender.rebiddingPrices).toHaveLength(2);
        });
    });

    it('Поле ввода должно быть отключено должно быть отключёной, если есть переторжки', () => {
        // Имитируем, что уже существует хотя бы одна переторжка
        fakeTender.rebiddingPrices = [{
            id: 1,
            price: '0',
            fileNames: [],
            addFile: vi.fn(),
            removeFile: vi.fn(),
            setPrice: vi.fn().mockReturnValue({ok: true, error: ''})
        } as RebiddingPrice];
        render(<StageForm2 tender={fakeTender as Tender} isEditable={true}/>);

        const currencyInput = screen.getByLabelText(/Наша цена:/) as HTMLInputElement;
        expect(currencyInput).toBeDisabled();
    });
});
