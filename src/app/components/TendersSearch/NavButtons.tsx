"use client"
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from './NavButtons.module.css';

export default function NavButtons(props: { remained: boolean }) {
    const searchParams = new URLSearchParams(useSearchParams());
    const pathname = usePathname()
    const page = parseInt(searchParams.get('page') || '0');
    const prev_page = page - 1;
    const next_page = page + 1;
    const current_link = <Link href={pathname + '?' + searchParams.toString()} className={styles.button + ' ' + styles.active} scroll={false}>{page+1}</Link>
    searchParams.set('page', prev_page.toString())
    const prev_link = <Link href={pathname + '?' + searchParams.toString()} className={styles.button} scroll={false}>{prev_page+1}</Link>
    searchParams.set('page', next_page.toString())
    const next_link = <Link href={pathname + '?' + searchParams.toString()} className={styles.button} scroll={false}>{next_page+1}</Link>
    return (
        <div className={styles.buttons}>
            {page > 0 && prev_link}
            {current_link}
            {props.remained && next_link}
        </div>
    )
}