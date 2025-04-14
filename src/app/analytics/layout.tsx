"use client"
import Link from 'next/link';
import {usePathname, useSearchParams} from 'next/navigation';
import styles from './layout.module.css'
import './table.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileExcel} from "@fortawesome/free-solid-svg-icons";

export default function LayoutPage({children,}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    return (
        <>
            <div id={styles.linkBar}>
                <Link href='./company'
                      className={`${styles.link} ${pathname === '/analytics/company' ? styles.active : ''}`}>По
                    организациям</Link>
                <Link href='./tenders'
                      className={`${styles.link} ${pathname === '/analytics/tenders' ? styles.active : ''}`}>Все
                    тендеры</Link>
                <Link href='./win_loose'
                      className={`${styles.link} ${pathname === '/analytics/win_loose' ? styles.active : ''}`}>Победили /
                    Проиграли</Link>
            </div>
            <a className={styles.download} href={`../api${pathname}/${searchParams.toString()}`} download>Экспорт в
                Excel <FontAwesomeIcon icon={faFileExcel}/></a>
            {children}
        </>
    )
}