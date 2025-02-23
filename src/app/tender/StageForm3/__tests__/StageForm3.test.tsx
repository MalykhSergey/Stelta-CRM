import React from 'react';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import StageForm3 from '../StageForm3';
import {Tender} from '@/models/Tender/Tender';
import {mockDeep} from "vitest-mock-extended";

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

describe('StageForm3', () => {
    let fakeTender: Tender;

    beforeEach(() => {
        fakeTender = mockDeep<Tender>({
            id: 1,
            contractDate: '2025-01-01',
            contractNumber: 'CN-001',
            stagedFileNames: [[]],
        });

        fakeTender.setContractDate = vi.fn();
        fakeTender.setContractNumber = vi.fn();
        fakeTender.addToStagedFileNames = vi.fn();
        fakeTender.removeFileFromStagedFileNames = vi.fn();

        cleanup();
        vi.clearAllMocks();
    });

    it('StageForm3 отображается корректно', () => {
        render(<StageForm3 tender={fakeTender as Tender} isEditable={true}/>);

        // Проверяем наличие заголовка "Договор"
        expect(screen.getByText('Договор')).toBeInTheDocument();

        // Проверяем отрисовку DocumentsForm с заголовком "Документы договора"
        expect(screen.getByTestId('documents-form-5')).toHaveTextContent('Документы договора');

        // Проверяем наличие и значение инпута даты
        const dateInput = screen.getByLabelText(/Дата заключения договора:/) as HTMLInputElement;
        expect(dateInput).toBeInTheDocument();
        expect(dateInput.value).toBe(fakeTender.contractDate);

        // Проверяем наличие и значение инпута номера договора
        const numberInput = screen.getByLabelText(/Номер заключения договора:/) as HTMLInputElement;
        expect(numberInput).toBeInTheDocument();
        expect(numberInput.value).toBe(fakeTender.contractNumber);
    });

    it('вызывает setContractDate когда изменяется дата договра', () => {
        render(<StageForm3 tender={fakeTender as Tender} isEditable={true}/>);
        const dateInput = screen.getByLabelText(/Дата заключения договора:/) as HTMLInputElement;
        fireEvent.change(dateInput, {target: {value: '2025-02-02'}});
        expect(fakeTender.setContractDate).toHaveBeenCalledWith('2025-02-02');
    });

    it('вызывает setContractNumber когда изменяется номер договора', () => {
        render(<StageForm3 tender={fakeTender as Tender} isEditable={true}/>);
        const numberInput = screen.getByLabelText(/Номер заключения договора:/) as HTMLInputElement;
        fireEvent.change(numberInput, {target: {value: 'CN-002'}});
        expect(fakeTender.setContractNumber).toHaveBeenCalledWith('CN-002');
    });

    it('запрещает редактирование когда пользователь не авторизован', () => {
        render(<StageForm3 tender={fakeTender as Tender} isEditable={false}/>);

        const dateInput = screen.getByLabelText(/Дата заключения договора:/) as HTMLInputElement;
        const numberInput = screen.getByLabelText(/Номер заключения договора:/) as HTMLInputElement;
        expect(dateInput).toBeDisabled();
        expect(numberInput).toBeDisabled();
    });

    it('переключает состояние формы через ExpandButton', () => {
        render(<StageForm3 tender={fakeTender as Tender} isEditable={true}/>);

        // Изначально collapsed.isTrue = true, значит ExpandButton получает expanded = !true = false и отображает "Expand"
        const expandButton = screen.getByTestId('expand-button');
        expect(expandButton).toHaveTextContent('Expand');

        // При клике состояние переключается и ExpandButton должен отобразить "Collapse"
        fireEvent.click(expandButton);
        expect(expandButton).toHaveTextContent('Collapse');
    });
});
