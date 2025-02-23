import React from 'react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import CommentsForm from '../CommentsForm';
import {mockDeep} from "vitest-mock-extended";
import {Tender} from "@/models/Tender/Tender";

vi.mock('@/models/Tender/Status', () => ({
    default: (index: number) => `Status ${index}`
}));

describe('CommentsForm Component', () => {
    const tender = mockDeep<Tender>()
    tender.status = 2
    tender.comments = ['Previous comment 0', 'Previous comment 1', '']

    beforeEach(() => {
        cleanup()
        render(<CommentsForm tender={tender}/>);
    });

    it('отображает предыдущие комментарии и текстовое поле для текущего комментария', () => {

        // Проверяем, что для предыдущих статусов (0 и 1) отображаются лейблы и комментарии
        expect(screen.getByText('Status 0')).toBeInTheDocument();
        expect(screen.getByText('Previous comment 0')).toBeInTheDocument();
        expect(screen.getByText('Status 1')).toBeInTheDocument();
        expect(screen.getByText('Previous comment 1')).toBeInTheDocument();

        // Проверяем, что для текущего статуса (2) отображается лейбл и пустое текстовое поле
        expect(screen.getByText('Status 2')).toBeInTheDocument();
        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveValue('');
    });

    it('обновляет комментарий тендера при изменении текстового поля', () => {
        const textarea = screen.getByRole('textbox');

        // Симулируем изменение значения текстового поля
        fireEvent.change(textarea, {target: {value: 'Updated comment'}});
        expect(tender.comments[tender.status]).toBe('Updated comment');
    });

    it('переключает состояние свёрнут/развёрнут по клику на кнопку ExpandButton', () => {
        // Ищем кнопку (предполагается, что ExpandButton рендерит элемент <button>)
        const button = screen.getByRole('button');
        expect(button).toBeDefined();

        // Перед кликом класс для развёрнутого состояния отсутствует
        const form = document.querySelector('.card')!;
        expect(form.className).not.toContain('expanded');

        // Симулируем клик по кнопке
        fireEvent.click(button!);

        // После клика контейнер должен содержать CSS-класс для развернутого состояния
        expect(form.className).toContain('expanded');
    });
});
