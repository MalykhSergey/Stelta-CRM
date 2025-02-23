import React from 'react';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import StageForm1 from '../StageForm1';
import {Tender} from '@/models/Tender/Tender';
import {addDocumentRequest} from "@/models/Tender/TenderService";
import {showMessage} from "@/app/components/Alerts/Alert";
import {mockDeep} from "vitest-mock-extended";

vi.mock('@/app/components/Alerts/Alert', () => ({
    showMessage: vi.fn()
}));
vi.mock('@/app/components/Buttons/ExpandButton/ExpandButton', () => ({
    ExpandButton: ({onClick, expanded}: { onClick: () => void; expanded: boolean; }) => (
        <button data-testid="expand-button" onClick={onClick}>
            {expanded ? 'Collapse' : 'Expand'}
        </button>
    )
}));
vi.mock('@/app/tender/DocumentForm/DocumentsForm', () => ({
    default: ({title, stage}: { title: string; stage: number; }) => (
        <div data-testid={`documents-form-${stage}`}>{title}</div>
    )
}));
vi.mock('@/models/Tender/TenderService', () => ({
    addDocumentRequest: vi.fn(),
    deleteDocumentRequestById: vi.fn()
}));

describe('StageForm1', () => {
    let fakeTender: Tender;

    beforeEach(() => {
        fakeTender = mockDeep<Tender>({
            id: 1,
            documentRequests: [],
            stagedFileNames: [[]]
        });
        cleanup();
        vi.clearAllMocks();
    });

    it('рендерит StageForm1 корректно', () => {
        render(<StageForm1 tender={fakeTender as Tender} isEditable={true}/>);

        // Проверяем наличие заголовка "Этап 1"
        expect(screen.getByText('Этап 1')).toBeInTheDocument();
        // Проверяем, что рендерится DocumentsForm с нужным заголовком
        expect(screen.getByTestId('documents-form-1')).toHaveTextContent('Формы 1 этапа');
        // Если форма редактируемая, должна присутствовать кнопка "Дозапрос документов"
        expect(screen.getByRole('button', {name: 'Дозапрос документов'})).toBeInTheDocument();
    });

    it('переключает состояние коллапса при клике на ExpandButton', () => {
        render(<StageForm1 tender={fakeTender as Tender} isEditable={true}/>);
        const expandButton = screen.getByTestId('expand-button');
        // Изначально, isEditable=true => collapsed.isTrue = true, значит ExpandButton получает expanded = !true = false
        expect(expandButton).toHaveTextContent('Expand');
        fireEvent.click(expandButton);
        // После клика, состояние переключается, expanded становится true
        expect(expandButton).toHaveTextContent('Collapse');
    });

    it('создаёт документ при клике на кнопку "Дозапрос документов" (успешный сценарий)', async () => {
        // Мокаем addDocumentRequest, чтобы вернуть успешный результат без ошибки
        vi.mocked(addDocumentRequest).mockResolvedValue(42);

        render(<StageForm1 tender={fakeTender as Tender} isEditable={true}/>);
        const createButton = screen.getByRole('button', {name: 'Дозапрос документов'});
        fireEvent.click(createButton);
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(addDocumentRequest).toHaveBeenCalledWith(fakeTender.id);
        });

        await waitFor(() => {
            // После успешного создания должен появиться DocumentRequest
            expect(fakeTender.documentRequests).toHaveLength(2);
        });
        // Проверяем, что вызвано успешное сообщение
        expect(showMessage).toHaveBeenCalledWith("Дозапрос успешно создан.", 'successful');
    });

    it('обрабатывает ошибку при создании документа', async () => {
        // Мокаем addDocumentRequest, чтобы вернуть объект с ошибкой
        vi.mocked(addDocumentRequest).mockResolvedValue({error: "Creation error"});

        render(<StageForm1 tender={fakeTender as Tender} isEditable={true}/>);
        const createButton = screen.getByRole('button', {name: 'Дозапрос документов'});
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(addDocumentRequest).toHaveBeenCalledWith(fakeTender.id);
        });

        // Проверяем, что вызвано сообщение с ошибкой
        expect(showMessage).toHaveBeenCalledWith("Creation error");
        // В случае ошибки документ не должен добавляться
        expect(fakeTender.documentRequests).toHaveLength(0);
    });
});
