import {ConfirmDialogProvider} from '@/app/components/Dialog/ConfirmDialogContext';
import FileName from '@/models/Tender/FileName';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import DocumentsForm from '../DocumentsForm';
import {uploadHandler} from '../Handler';


vi.mock('../Handler', () => ({
    deleteHandler: vi.fn(),
    uploadHandler: vi.fn().mockResolvedValue([
        {id: 1, name: 'test1.pdf'},
        {id: 2, name: 'test2.pdf'}
    ])
}));

describe('DocumentsForm', () => {
    const mockFileNames: FileName[] = [
        {id: 1, name: 'test1.pdf'},
        {id: 2, name: 'test2.pdf'}
    ];
    const mockProps = {
        tenderId: 1,
        stage: 1,
        fileNames: mockFileNames,
        pushFile: vi.fn(),
        removeFile: vi.fn(),
        title: 'Тестовые документы',
        isEditable: true
    };

    const setup = (props = mockProps) => {
        return render(
            <ConfirmDialogProvider>
                <DocumentsForm {...props} />
            </ConfirmDialogProvider>
        );
    };

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('должен отображать заголовок и список файлов', () => {
        setup();

        expect(screen.getByText('Тестовые документы')).toBeDefined();
        expect(screen.getByText('test1.pdf')).toBeDefined();
        expect(screen.getByText('test2.pdf')).toBeDefined();
    });

    it('должен отображать кнопку прикрепления файла только в режиме редактирования', () => {
        const {rerender} = setup();

        // В режиме редактирования
        expect(screen.getByLabelText('Прикрепить')).toBeDefined();

        // В режиме просмотра
        rerender(
            <ConfirmDialogProvider>
                <DocumentsForm {...mockProps} isEditable={false}/>
            </ConfirmDialogProvider>
        );
        expect(screen.queryByLabelText('Прикрепить')).toBeNull();
    });

    it('должен отображать кнопки удаления для каждого файла в режиме редактирования', () => {
        setup();

        const deleteButtons = screen.getAllByLabelText('Удалить');
        expect(deleteButtons).toHaveLength(mockFileNames.length);
    });

    it('должен иметь правильные ссылки для скачивания файлов', () => {
        setup();

        mockFileNames.forEach(file => {
            const link = screen.getByText(file.name).closest('a');
            expect(link).toHaveAttribute('href', `/download/${mockProps.tenderId}/${file.id}/${file.name}`);
        });
    });

    it('должен переключать состояние развернутости при клике на кнопку разворачивания', () => {
        setup();

        const expandButton = screen.getByLabelText('Развернуть');
        const container = screen.getByTestId('documents-container');

        // Проверяем начальное состояние
        expect(container.className).not.toMatch(/expanded/);
        expect(expandButton.className).toMatch(/rotated/);

        // Первый клик
        fireEvent.click(expandButton);
        expect(container.className).toMatch(/expanded/);
        expect(expandButton.className).not.toMatch(/rotated/);


        // Второй клик
        fireEvent.click(expandButton);
        expect(container.className).not.toMatch(/expanded/);
        expect(expandButton.className).toMatch(/rotated/);
    });

    it('должен вызывать диалог подтверждения при удалении файла и удалять файл после подтверждения', async () => {
        setup();

        expect(screen.getByText('test1.pdf')).toBeDefined();

        const deleteButton = screen.getAllByLabelText('Удалить')[0];
        fireEvent.click(deleteButton);

        expect(screen.getByText(/Вы действительно хотите удалить test1.pdf?/)).toBeDefined();

        const confirmButton = screen.getByText('Да');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockProps.removeFile).toHaveBeenCalledWith(mockFileNames[0]);
        });

    });

    it('должен загружать файлы и добавлять их в список', async () => {
        setup();

        const attachButton = screen.getByLabelText('Прикрепить');
        fireEvent.click(attachButton);

        const fileInput = screen.getByTestId('documents-container').querySelector('input[type="file"]');
        const testFile = new File(['test content'], 'newfile.pdf', {type: 'application/pdf'});

        fireEvent.change(fileInput!, {target: {files: [testFile]}});

        await waitFor(() => {
            expect(uploadHandler).toHaveBeenCalled();
            expect(mockProps.pushFile).toHaveBeenCalledWith(mockFileNames[0]);
            expect(mockProps.pushFile).toHaveBeenCalledWith(mockFileNames[1]);
        });
    });
}); 