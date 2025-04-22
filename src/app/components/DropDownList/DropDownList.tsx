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
    onSelect: (item: T) => void;
    /** Значение по умолчанию */
    defaultValue?: string;
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
                                    defaultValue = '',
                                    placeholder = '',
                                    disabled = false,
                                }: DropDownListProps<T>) {
    const [query, setQuery] = useState<string>('');
    useEffect(()=>{setQuery(defaultValue || '')},[defaultValue])
    // Фильтрация по подстроке (регистр не учитывается)
    const filteredItems = useMemo(() => {
        if (!query) return items;
        const lower = query.toLowerCase();
        return items.filter(item => {
            const fieldValue = String(item[labelField] ?? '');
            return fieldValue.toLowerCase().includes(lower);
        });
    }, [items, query, labelField]);

    return (
        <div className={styles.container}>
            <input
                type="search"
                className={styles.input}
                value={query}
                placeholder={placeholder}
                disabled={disabled}
                onChange={e => setQuery(e.target.value)}
            />

            <FontAwesomeIcon
                icon={faChevronUp}
                className={styles.chevron}
            />

            {filteredItems.length > 0 && (
                <div className={styles.listContainer}>
                    {filteredItems.map(item => (
                        <div
                            key={String(item[keyField])}
                            className={styles.item}
                            onMouseDown={() => onSelect(item)}
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