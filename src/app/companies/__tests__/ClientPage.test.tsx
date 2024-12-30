import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import ClientCompanies from '../ClientPage'
import { createCompany, deleteCompany, updateCompany } from '@/models/Company/CompanyService'
import { showMessage } from '../../components/Alerts/Alert'

vi.mock('@/models/Company/CompanyService')
vi.mock('../../components/Alerts/Alert')

describe('ClientCompanies', () => {
    const mockCompanies = JSON.stringify([
        { id: 1, name: 'Компания 1', contactPersons: [] },
        { id: 2, name: 'Компания 2', contactPersons: [] }
    ])

    beforeEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    it('должен рендерить список компаний', () => {
        render(<ClientCompanies companiesProps={mockCompanies} />)
        expect(screen.getByText('Компания 1')).toBeInTheDocument()
        expect(screen.getByText('Компания 2')).toBeInTheDocument()
    })

    it('должен создавать новую компанию', async () => {
        vi.mocked(createCompany).mockResolvedValue('3')

        render(<ClientCompanies companiesProps={mockCompanies} />)
        const form = screen.getByRole('form', { name: 'Добавить организацию' })
        const input = form.querySelector('textarea')!
        fireEvent.change(input, { target: { value: 'Новая Компания' } })
        fireEvent.submit(form)
        await waitFor(() => {
            expect(createCompany).toHaveBeenCalledWith('Новая Компания')
            expect(showMessage).toHaveBeenCalledWith('Организация успешно добавлена!', 'successful')

        })
    })

    it('должен обновлять существующую компанию', async () => {

        render(<ClientCompanies companiesProps={mockCompanies} />)

        const companyInput = screen.getAllByRole('textbox')[1] // первая компания в списке
        fireEvent.change(companyInput, { target: { value: 'Обновленная Компания' } })

        const updateForm = companyInput.closest('form')!
        fireEvent.submit(updateForm)
        await waitFor(() => {
            expect(updateCompany).toHaveBeenCalled()
            expect(showMessage).toHaveBeenCalledWith('Организация успешно обновлена!', 'successful')
        })
    })

    it('должен удалять компанию', async () => {

        render(<ClientCompanies companiesProps={mockCompanies} />)

        const deleteButton = screen.getAllByLabelText('Удалить')[0]

        fireEvent.click(deleteButton)
        await waitFor(() => {
            expect(deleteCompany).toHaveBeenCalledWith(1)
            expect(showMessage).toHaveBeenCalledWith('Организация успешно удалена!', 'successful')
        })
    })

    it('должен показывать ошибку при неудачном создании', async () => {
        vi.mocked(createCompany).mockResolvedValue({ error: 'Ошибка создания' })

        render(<ClientCompanies companiesProps={mockCompanies} />)

        const addCompanySection = screen.getByRole('heading', { name: 'Добавить организацию' }).closest('div')
        const form = addCompanySection!.querySelector('form')!

        const input = form.querySelector('textarea')!
        fireEvent.change(input, { target: { value: 'Новая Компания' } })

        fireEvent.submit(form)

        await waitFor(() => {
            expect(createCompany).toHaveBeenCalledWith('Новая Компания')
            expect(showMessage).toHaveBeenCalledWith('Ошибка создания')
        })
    })
}) 