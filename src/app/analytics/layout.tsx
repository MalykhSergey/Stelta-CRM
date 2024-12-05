"use client"
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import styles from './layout.module.css';

export default function LayoutPage({children,}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <>
            <div id={styles.tabBar}>
                <Link href='./common'
                      className={`${styles.tab} ${pathname === '/analytics/common' ? styles.active : ''}`}>Общая</Link>
                <Link href='./company'
                      className={`${styles.tab} ${pathname === '/analytics/company' ? styles.active : ''}`}>По
                    организациям</Link>
                <Link href='./date' className={`${styles.tab} ${pathname === '/analytics/date' ? styles.active : ''}`}>По
                    дате</Link>
                <Link href='./status'
                      className={`${styles.tab} ${pathname === '/analytics/status' ? styles.active : ''}`}>По
                    статусу</Link>
            </div>
            <div id={styles.content} className='shadowed'>
                {children}
            </div>
        </>
    )
}