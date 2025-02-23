import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import TendersFilter from '../TendersFilter';
import {Tender} from "@/models/Tender/Tender";
import {mockDeep} from 'vitest-mock-extended';
import Company from "@/models/Company/Company";



const tenderMockA = mockDeep<Tender>();
tenderMockA.status = 1;
tenderMockA.regNumber = "12345";
tenderMockA.name = "Tender One";
const companyA = mockDeep<Company>();
tenderMockA.company = companyA;
companyA.name = "Company A"
tenderMockA.statusDate = new Date("2023-01-15").getTime();
tenderMockA.startDateRange = new Date("2023-01-01").getTime();
tenderMockA.endDateRange = new Date("2023-01-31").getTime();

const tenderMockB = mockDeep<Tender>();
tenderMockB.status = 0;
tenderMockB.regNumber = "67890";
tenderMockB.name = "Tender Two";
const companyB = mockDeep<Company>();
companyB.name = "Company B"
tenderMockB.company = companyB;
tenderMockB.statusDate = new Date("2023-02-15").getTime();
tenderMockB.startDateRange = new Date("2023-02-01").getTime();
tenderMockB.endDateRange = new Date("2023-02-28").getTime();

const tenders = [tenderMockA, tenderMockB]

describe('TendersFilter Component', () => {
    it('фильтрует тендеры по статусу', () => {
        const setTenders = vi.fn();
        render(
            <TendersFilter allTenders={tenders} setTenders={setTenders} simpleRange={true}/>
        );

        // Выбираем элемент <select> для статуса (единственный комбобокс на странице)
        const statusSelect = screen.getByRole('combobox');
        // Устанавливаем значение "1"
        fireEvent.change(statusSelect, {target: {value: "1"}});

        // Ожидаем, что останется только тендер с status === 1
        expect(setTenders).toHaveBeenCalledWith([tenders[0]]);
    });

    it('фильтрует тендеры по реестровому номеру', () => {
        const setTenders = vi.fn();
        render(
            <TendersFilter allTenders={tenders} setTenders={setTenders} simpleRange={true}/>
        );

        // Находим поле ввода по placeholder
        const regInput = screen.getByLabelText('Реестровый номер:');
        fireEvent.change(regInput, {target: {value: "678"}});

        // Ожидаем, что останется тендер с regNumber, содержащим "678"
        waitFor(() => {
            expect(setTenders).toHaveBeenCalledWith([tenders[1]]);
        })
    });

    it('фильтрует тендеры по полному наименованию (без учёта регистра)', () => {
        const setTenders = vi.fn();
        render(
            <TendersFilter allTenders={tenders} setTenders={setTenders} simpleRange={true}/>
        );

        const fullNameInput = screen.getByLabelText("Полное наименование:");
        fireEvent.change(fullNameInput, {target: {value: "tender one"}});
        waitFor(() => {
            expect(setTenders).toHaveBeenCalledWith([tenders[0]]);
        })
    });

    it('фильтрует тендеры по названию организации (без учёта регистра)', () => {
        const setTenders = vi.fn();
        render(
            <TendersFilter allTenders={tenders} setTenders={setTenders} simpleRange={true}/>
        );

        const companyInput = screen.getByLabelText("Организация:");
        fireEvent.change(companyInput, {target: {value: "company b"}});
        waitFor(()=>{
            expect(setTenders).toHaveBeenCalledWith([tenders[1]]);
        })
    });

    it('фильтрует тендеры по диапазону дат для simpleRange = true', () => {
        const setTenders = vi.fn();
        const {container} = render(
            <TendersFilter allTenders={tenders} setTenders={setTenders} simpleRange={true}/>
        );

        // Получаем все input типа date
        const dateInputs = container.querySelectorAll('input[type="date"]');
        expect(dateInputs.length).toBe(2);

        // Устанавливаем начальную дату так, чтобы остался только тендер со statusDate после 2023-02-01
        fireEvent.change(dateInputs[0], {target: {value: "2023-02-01"}});
        waitFor(()=>{
            expect(setTenders).toHaveBeenCalledWith([tenders[1]]);
        })
    });

    it('фильтрует тендеры по диапазону дат для simpleRange = false', () => {
        const setTenders = vi.fn();
        const {container} = render(
            <TendersFilter allTenders={tenders} setTenders={setTenders} simpleRange={false}/>
        );

        const dateInputs = container.querySelectorAll('input[type="date"]');
        expect(dateInputs.length).toBe(2);

        // Для режима simpleRange = false используется сравнение с startDateRange и endDateRange.
        // Установим стартовую дату так, чтобы прошёл только тендер, у которого startDateRange >= 2023-02-01
        fireEvent.change(dateInputs[0], {target: {value: "2023-02-01"}});
        waitFor(()=>{
            expect(setTenders).toHaveBeenCalledWith([tenders[1]]);
        })
    });
});
