"use client"
import { useAuth } from '@/app/AuthContext';
import Image from 'next/image';
import Link from "next/link";
import SteltaLogo from '../../images/logo.png';
import styles from "./Header.module.css";
import { usePathname } from 'next/navigation';
export default function Header() {
    const authContext = useAuth()
    const pathname = usePathname()
    return (
        <header className={styles.header}>
            <Link href='/'><Image src={SteltaLogo} alt={"Stelta logo"} width={120} height={65}></Image></Link>
            <div className={styles.navPanel}>
                <Link href="/" className={`${styles.navLink} ${pathname == '/' ? styles.active : ''}`}>Торги</Link>
                <Link href="/search" className={`${styles.navLink} ${pathname == '/search' ? styles.active : ''}`}>Поиск</Link>
                <Link href="/companies" className={`${styles.navLink} ${pathname == '/companies' ? styles.active : ''}`}>Организации</Link>
                <Link href="/analytics/common" className={`${styles.navLink} ${pathname.includes('analytics') ? styles.active : ''}`}>Аналитика</Link>
                {authContext.userName ? <Link href="/logout" className={styles.navLink}>Выйти</Link> : <Link href="/login" className={`${styles.navLink} ${pathname == '/login' ? styles.active : ''}`}>Войти</Link>}
            </div>
        </header>
    )
}