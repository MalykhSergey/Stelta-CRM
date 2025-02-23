import React from 'react';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import DocumentRequestForm from '../DocumentRequestForm';
import {DocumentRequest} from '@/models/Tender/DocumentRequest';
import {mockDeep} from "vitest-mock-extended";

vi.mock('@/app/tender/DocumentForm/DocumentsForm', () => ({
    default: ({onDelete, title}: { onDelete: () => void; title: string }) => (
        <div data-testid="documents-form">
            <span>{title}</span>
            <button data-testid="delete-button" onClick={onDelete}>Delete</button>
        </div>
    )
}));

describe('DocumentRequestForm', () => {
    let fakeDocumentRequest: DocumentRequest;
    let deleteDocumentRequestMock: () => void;

    beforeEach(() => {
        fakeDocumentRequest = mockDeep<DocumentRequest>({
            id: 1,
            date: '2025-01-01',
            fileNames: [],
        });
        deleteDocumentRequestMock = vi.fn();
        cleanup();
        vi.clearAllMocks();
    });

    it('рендерит DocumentRequestForm с корректной меткой и значением даты', () => {
        render(
            <DocumentRequestForm
                tenderId={1}
                documentRequest={fakeDocumentRequest as DocumentRequest}
                orderNumber={2}
                isEditable={true}
                deleteDocumentRequest={deleteDocumentRequestMock}
            />
        );

        // Проверяем, что DocumentsForm отрендерен с правильным заголовком
        expect(screen.getByTestId('documents-form')).toHaveTextContent('Дозапрос документов 2');

        // Проверяем наличие метки "Дата предоставления ответа" и корректное значение инпута
        const dateInput = screen.getByLabelText(/Дата предоставления ответа/) as HTMLInputElement;
        expect(dateInput).toBeInTheDocument();
        expect(dateInput.value).toBe('2025-01-01');
        expect(dateInput).not.toBeDisabled();
    });

    it('вызывает setDate при изменении значения даты, если форма редактируемая', () => {
        render(
            <DocumentRequestForm
                tenderId={1}
                documentRequest={fakeDocumentRequest as DocumentRequest}
                orderNumber={1}
                isEditable={true}
                deleteDocumentRequest={deleteDocumentRequestMock}
            />
        );

        const dateInput = screen.getByLabelText(/Дата предоставления ответа/) as HTMLInputElement;
        fireEvent.change(dateInput, {target: {value: '2025-02-01'}});
        expect(fakeDocumentRequest.setDate).toHaveBeenCalledWith('2025-02-01');
    });

    it('блокирует ввод даты, если форма не редактируемая', () => {
        render(
            <DocumentRequestForm
                tenderId={1}
                documentRequest={fakeDocumentRequest as DocumentRequest}
                orderNumber={1}
                isEditable={false}
                deleteDocumentRequest={deleteDocumentRequestMock}
            />
        );

        const dateInput = screen.getByLabelText(/Дата предоставления ответа/) as HTMLInputElement;
        expect(dateInput).toBeDisabled();
    });

    it('вызывает deleteDocumentRequest при клике на кнопку удаления', () => {
        render(
            <DocumentRequestForm
                tenderId={1}
                documentRequest={fakeDocumentRequest as DocumentRequest}
                orderNumber={1}
                isEditable={true}
                deleteDocumentRequest={deleteDocumentRequestMock}
            />
        );

        const deleteButton = screen.getByTestId('delete-button');
        fireEvent.click(deleteButton);
        expect(deleteDocumentRequestMock).toHaveBeenCalled();
    });
});
