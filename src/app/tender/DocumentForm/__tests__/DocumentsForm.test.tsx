import {ConfirmDialogProvider} from '@/app/components/Dialog/ConfirmDialogContext';
import FileName, {FileType} from '@/models/Tender/FileName';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import DocumentsForm from '../DocumentsForm';


vi.mock('../Handler', () => ({
    deleteHandler: vi.fn(),
    uploadHandler: vi.fn().mockResolvedValue([
        {id: 1, name: 'test1.pdf'},
        {id: 2, name: 'test2.pdf'}
    ])
}));

describe('DocumentsForm', () => {
    const mockProps = {
        tenderId: 1,
        stage: 1,
        fileNames: [
            {id: 1, tenderId: 1, parentId: 0, name: 'test1.pdf', fileType: FileType.Tender},
            {id: 2, tenderId: 1, parentId: 0, name: 'test2.pdf', fileType: FileType.Tender}
        ],
        title: 'Тестовые документы',
        isEditable: true
    };

    const setup = (props = mockProps) => {
        mockProps.fileNames = [
            {id: 1, tenderId: 1, parentId: 0, name: 'test1.pdf', fileType: FileType.Tender},
            {id: 2, tenderId: 1, parentId: 0, name: 'test2.pdf', fileType: FileType.Tender}
        ]
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


        expect(screen.getByLabelText('Прикрепить')).toBeDefined();


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
        expect(deleteButtons).toHaveLength(mockProps.fileNames.length);
    });

    it('должен иметь правильные ссылки для скачивания файлов', () => {
        setup();

        mockProps.fileNames.forEach(file => {
            const link = screen.getByText(file.name).closest('a');
            expect(link).toHaveAttribute('href', `/download/?fileName=${encodeURIComponent(FileName.getFilePath(file))}`);
        });
    });

    it('должен переключать состояние развернутости при клике на кнопку разворачивания', () => {
        setup();

        const expandButton = screen.getByLabelText('Развернуть');
        const container = screen.getByLabelText('Тестовые документы');


        expect(container.className).not.toMatch(/expanded/);
        expect(expandButton.className).toMatch(/rotated/);

        fireEvent.click(expandButton);
        expect(container.className).toMatch(/expanded/);
        expect(expandButton.className).not.toMatch(/rotated/);


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
            expect(mockProps.fileNames.length == 1)
        });

    });

    it('должен загружать файлы и добавлять их в список', async () => {
        setup();

        const attachButton = screen.getByLabelText('Прикрепить');
        fireEvent.click(attachButton);

        const fileInput = screen.getByLabelText('Тестовые документы').querySelector('input[type="file"]');
        const file = new File(['test content'], 'test.txt', {type: 'text/plain'});
        fireEvent.change(fileInput!, {target: {files: [file]}});

        await waitFor(() => {
            expect(mockProps.fileNames.length == 3);
        });
    });
}); 