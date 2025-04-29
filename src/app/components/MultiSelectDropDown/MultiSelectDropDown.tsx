"use client"
import styles from './MultiSelectDropDown.module.css';
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp} from "@fortawesome/free-solid-svg-icons";

type MultiSelectProps = {
    name: string
    items: string[],
    labels?: string[],
    defaultValue: string
}

export default function MultiSelectDropdown({name, items, labels, defaultValue}: MultiSelectProps) {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<string[]>(
        defaultValue ? defaultValue.split(',') : []
    )
    const ref = useRef<HTMLDivElement>(null)
    // Закрыть дропдаун при клике вне
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleItem = (value: string) => {
        setSelected(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        )
    }

    return (
        <div className={styles.container} ref={ref}>
            <button
                type="button"
                className={styles.button}
                onClick={() => setOpen(o => !o)}
            >
                {selected.length > 0 ? `Выбрано: ${selected.length}` : 'Любой'}
                <FontAwesomeIcon className={`${styles.icon} ${open ? styles.rotate : ''}`} icon={faChevronUp}/>
            </button>
            <div className={`${styles.dropdown} ${open ? styles.open : ''}`}>
                {items.map((item, i) => (
                    <label key={item} className={styles.multiselectItem}>
                        <input
                            type="checkbox"
                            name={name}
                            value={item}
                            checked={selected.includes(item)}
                            onChange={() => toggleItem(item)}
                        />
                        {labels ? labels[i] : item}
                    </label>
                ))}
            </div>
        </div>
    )
}