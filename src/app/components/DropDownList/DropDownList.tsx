import React, {useMemo, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronUp} from '@fortawesome/free-solid-svg-icons';
import styles from './DropDownList.module.css';

/**
 * Параметры дропдауна со списком строковых полей
 */
export interface DropDownListProps {
    /** Массив объектов */
    items: string[];
    /** Коллбэк при выборе элемента */
    onChange: (value: string) => void;
    /** Имя поля ввода */
    name?: string;
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
 */
export function DropDownList({
                                 items,
                                 onChange,
                                 name = 'dropdown',
                                 defaultValue = '',
                                 placeholder = '',
                                 disabled = false,
                             }: DropDownListProps) {
    const [value, setValue] = useState(defaultValue)
    const updateValue = (new_value: string) => {
        setValue(new_value);
        onChange(new_value);
    }
    const filteredItems = useMemo(() => {
        if (!value) return items;
        const lower = value.toLowerCase();
        return items.filter(item => {
            return item.toLowerCase().includes(lower);
        });
    }, [items, value]);
    return (
        <div className={styles.container}>
            <input
                id={name}
                name={name}
                type="search"
                className={styles.input}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={e => updateValue(e.target.value)}
            />
            {!disabled && <FontAwesomeIcon
                icon={faChevronUp}
                className={styles.chevron}
            />}
            {filteredItems.length > 0 && (
                <div className={styles.listContainer}>
                    {filteredItems.map((item,id) => (
                        <div
                            key={id}
                            className={styles.item}
                            onMouseDown={() => {
                                updateValue(item)
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DropDownList;