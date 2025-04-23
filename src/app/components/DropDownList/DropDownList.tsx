import React, {useEffect, useMemo, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronUp} from '@fortawesome/free-solid-svg-icons';
import styles from './DropDownList.module.css';

/**
 * Параметры универсального дропдауна со списком строковых полей
 * @template T
 */
export interface DropDownListProps<T> {
    /** Массив объектов */
    items: T[];
    /** Ключ поля для уникального идентификатора */
    keyField: keyof T;
    /** Ключ поля для отображаемого текста */
    labelField: keyof T;
    /** Коллбэк при выборе элемента */
    onSelect?: (item: T) => void;
    /** Имя поля ввода */
    name?: string;
    /** Значение по умолчанию */
    defaultValue?: string;
    /** Значение по умолчанию */
    emptyValue: T;
    /** Плейсхолдер для поля поиска */
    placeholder?: string;
    /** Заблокировать ввод */
    disabled?: boolean;
}

/**
 * Универсальный компонент DropDownList
 * Выводит инпут с поиском и выпадающий список
 * @template T
 */
export function DropDownList<T>({
                                    items,
                                    keyField,
                                    labelField,
                                    onSelect,
                                    name = 'dropdown',
                                    defaultValue = '',
                                    emptyValue,
                                    placeholder = '',
                                    disabled = false,
                                }: DropDownListProps<T>) {
    const [query, setQuery] = useState<string>('');
    const updateQuery = (value: string) => {
        if (!value)
            onSelect(emptyValue)
        setQuery(value)
    }
    useEffect(() => {
        setQuery(defaultValue || '')
    }, [defaultValue])
    // Фильтрация по подстроке (регистр не учитывается)
    const filteredItems = useMemo(() => {
        if (!query) return items;
        const lower = query.toLowerCase();
        return items.filter(item => {
            const fieldValue = String(item[labelField] ?? '');
            return fieldValue.toLowerCase().includes(lower);
        });
    }, [items, query, labelField]);
    useEffect(() => {
        if (filteredItems.length == 1) {
            onSelect(filteredItems[0])
        }
    }, [filteredItems])
    return (
        <div className={styles.container}>
            <input
                id={name}
                name={name}
                type="search"
                className={styles.input}
                value={query}
                placeholder={placeholder}
                disabled={disabled}
                onChange={e => updateQuery(e.target.value)}
            />
            {!disabled && <FontAwesomeIcon
                icon={faChevronUp}
                className={styles.chevron}
            />}
            {filteredItems.length > 0 && (
                <div className={styles.listContainer}>
                    {filteredItems.map(item => (
                        <div
                            key={String(item[keyField])}
                            className={styles.item}
                            onMouseDown={() => onSelect ? onSelect(item) : setQuery(item[keyField] as string)}
                        >
                            {String(item[labelField])}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DropDownList;