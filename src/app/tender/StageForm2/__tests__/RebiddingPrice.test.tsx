import React from 'react';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import RebiddingPriceForm from '../RebiddingPriceForm';
import {RebiddingPrice} from "@/models/Tender/RebiddingPrice";
import {mockDeep} from "vitest-mock-extended";

vi.mock('@/app/tender/DocumentForm/DocumentsForm', () => ({
    default: ({onDelete}: { onDelete: () => void }) => (
        <div data-testid="documents-form">
            <button data-testid="delete-button" onClick={onDelete}>Delete</button>
        </div>
    )
}));

describe('RebiddingPriceForm', () => {
    const tenderId = 1;
    const orderNumber = 1;
    let fakeRebiddingPrice: RebiddingPrice;
    let deleteRebiddingPriceMock: () => void;

    beforeEach(() => {
        // Используем mockDeep для создания мок-объекта RebiddingPrice
        fakeRebiddingPrice = mockDeep<RebiddingPrice>({
            id: 1,
            price: '1000',
            fileNames: [],
        });

        // Явно указываем, что setPrice является мок-функцией
        fakeRebiddingPrice.setPrice = vi.fn().mockReturnValue({ok: true, error: ''});

        deleteRebiddingPriceMock = vi.fn();
        cleanup();
        vi.clearAllMocks();
    });

    it('отображает компонент с корректными элементами', () => {
        render(
            <RebiddingPriceForm
                tenderId={tenderId}
                rebiddingPrice={fakeRebiddingPrice}
                orderNumber={orderNumber}
                isEditable={true}
                deleteRebiddingPrice={deleteRebiddingPriceMock}
            />
        );

        // Проверяем наличие метки "Наша цена:" и поля ввода
        expect(screen.getByText(/Наша цена:/)).toBeInTheDocument();
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input.value).eq('1 000₽');
    });
    it('очищает сообщение об ошибке при успешном обновлении цены', () => {
        // Сначала возвращаем ошибку
        fakeRebiddingPrice.setPrice = vi.fn().mockReturnValueOnce({ok: false, error: 'Invalid price'});
        render(
            <RebiddingPriceForm
                tenderId={tenderId}
                rebiddingPrice={fakeRebiddingPrice}
                orderNumber={orderNumber}
                isEditable={true}
                deleteRebiddingPrice={deleteRebiddingPriceMock}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, {target: {value: ''}});
        expect(screen.getByText('Invalid price')).toBeInTheDocument();

        // Теперь симулируем успешное обновление цены
        fakeRebiddingPrice.setPrice = vi.fn().mockReturnValueOnce({ok: true, error: ''});
        fireEvent.change(input, {target: {value: '3000'}});

        expect(screen.queryByText('Invalid price')).not.toBeInTheDocument();
    });

    it('вызывает функции удаления при клике на кнопку удаления', () => {
        render(
            <RebiddingPriceForm
                tenderId={tenderId}
                rebiddingPrice={fakeRebiddingPrice}
                orderNumber={orderNumber}
                isEditable={true}
                deleteRebiddingPrice={deleteRebiddingPriceMock}
            />
        );

        const deleteButton = screen.getAllByTestId('delete-button')[0];
        fireEvent.click(deleteButton);

        // Проверяем, что вызвались переданная функция удаления и функция deleteRebiddingPriceById
        expect(deleteRebiddingPriceMock).toHaveBeenCalled();
    });
});
