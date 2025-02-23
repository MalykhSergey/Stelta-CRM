import { AuthProvider } from '@/app/AuthContext'
import { createCompany, deleteCompany, updateCompany } from '@/models/Company/CompanyService'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { showMessage } from '../../components/Alerts/Alert'
import ClientCompanies from '../ClientPage'
import {Role, User} from "@/models/User/User";

vi.mock('@/models/Company/CompanyService')
vi.mock('../../components/Alerts/Alert')

describe('ClientCompanies', () => {
    const mockCompanies = JSON.stringify([
        { id: 1, name: 'Компания 1', contactPersons: [] },
        { id: 2, name: 'Компания 2', contactPersons: [] }
    ])

    const renderWithAuth = (auth = true) => {
        const viewer_user = new User();
        viewer_user.role = Role.Viewer
        viewer_user.name = "viewer"
        const editor_user = new User();
        editor_user.role = Role.Editor
        editor_user.name = "editor"
        return render(
            <AuthProvider initialAuth={auth ? editor_user : viewer_user}>
                <ClientCompanies companiesProps={mockCompanies} />
            </AuthProvider>
        )
    }

    beforeEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    it('должен рендерить список компаний', () => {
        renderWithAuth(true)
        expect(screen.getByText('Компания 1')).toBeInTheDocument()
        expect(screen.getByText('Компания 2')).toBeInTheDocument()
    })

    it('должен создавать новую компанию', async () => {
        vi.mocked(createCompany).mockResolvedValue('3')

        renderWithAuth(true)
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

        renderWithAuth(true)

        const companyInput = screen.getByText('Компания 1')
        fireEvent.paste(companyInput,"Обновлённая компания")
        const saveButton = screen.getAllByLabelText('Сохранить')[0]
        fireEvent.click(saveButton)
        await waitFor(() => {
            expect(updateCompany).toHaveBeenCalled()
            expect(showMessage).toHaveBeenCalledWith('Организация успешно обновлена!', 'successful')
        })
    })

    it('должен удалять компанию', async () => {

        renderWithAuth(true)

        const deleteButton = screen.getAllByLabelText('Удалить')[0]

        fireEvent.click(deleteButton)
        await waitFor(() => {
            expect(deleteCompany).toHaveBeenCalledWith(1)
            expect(showMessage).toHaveBeenCalledWith('Организация успешно удалена!', 'successful')
        })
    })

    it('должен показывать ошибку при неудачном создании', async () => {
        vi.mocked(createCompany).mockResolvedValue({ error: 'Ошибка создания' })

        renderWithAuth(true)

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

    it('должен скрывать элементы управления для неавторизованного пользователя', () => {
        renderWithAuth(false)
        expect(screen.queryByRole('button', { name: 'Удалить' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Сохранить' })).not.toBeInTheDocument()
    })
}) 