"use client"
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import styles from './NavButtons.module.css';

export default function NavButtons() {
    const searchParams = new URLSearchParams(useSearchParams());
    const page = parseInt(searchParams.get('page') || '0');
    const prev_page = page - 1;
    const next_page = page + 1;
    const current_link = <Link href={'./?' + searchParams.toString()} className={styles.button}>{page}</Link>
    searchParams.set('page', prev_page.toString())
    const prev_link = <Link href={'./?' + searchParams.toString()} className={styles.button}>{prev_page}</Link>
    searchParams.set('page', next_page.toString())
    const next_link = <Link href={'./?' + searchParams.toString()} className={styles.button}>{next_page}</Link>
    return (
        <div className={styles.buttons}>
            {page > 0 && prev_link}
            {current_link}
            {next_link}
        </div>
    )
}