"use client"
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import styles from  './layout.module.css'
import './table.css'

export default function LayoutPage({children,}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <>
            <div id={styles.linkBar}>
                <Link href='./company'
                      className={`${styles.link} ${pathname === '/analytics/company' ? styles.active : ''}`}>По организациям</Link>
                <Link href='./tenders'
                      className={`${styles.link} ${pathname === '/analytics/tenders' ? styles.active : ''}`}>Все тендеры</Link>
                <Link href='./win_loose'
                      className={`${styles.link} ${pathname === '/analytics/win_loose' ? styles.active : ''}`}>Победа / Поражение</Link>
            </div>
            {/*<div id={styles.content} className='shadowed'>*/}
                {children}
            {/*</div>*/}
        </>
    )
}