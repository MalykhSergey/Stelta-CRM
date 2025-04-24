'use client'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import React from 'react'
import {PrimaryButton} from "../Buttons/PrimaryButton/PrimaryButton";
import DropDownList from "@/app/components/DropDownList/DropDownList";
import styles from './FilterForm.module.css';

export type FieldConfig = {
    name: string
    label: string
    type: 'date' | 'text' | 'dropdown'
    values?: string[]
    defaultValue?: string
}

type Props = {
    fields: FieldConfig[]
}

export function FilterForm({fields}: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()

    const initial: Record<string, string> = {}
    fields.forEach(f => {
        const val = params.get(f.name)
        initial[f.name] = val ?? f.defaultValue ?? ''
    })

    const handler = (form: FormData) => {
        const query = fields.reduce((acc, f) => {
            const value = form.get(f.name)
            if (value)
                acc[f.name] = value as string
            return acc
        }, {} as Record<string, string>)
        router.push(pathname + '?' + new URLSearchParams(query))
    }

    return (
        <form action={handler} id={styles.form} className='card'>
            {fields.map(field => (
                <div key={field.name} className='row-inputs'>
                    <label htmlFor={field.name}>{field.label}</label>
                    {field.type === 'dropdown' ? (
                        <DropDownList key={field.label}
                                      items={field.values || []}
                                      name={field.name}
                                      defaultValue={initial[field.name]}
                                      onChange={()=>{}}
                                      />
                    ) : (
                        <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            defaultValue={initial[field.name]}
                        />
                    )}
                </div>
            ))}
            <PrimaryButton id={styles.sendButton}>Рассчитать</PrimaryButton>
        </form>
    )
}