"use client"
import { useAuth } from '@/app/AuthContext';
import Image from 'next/image';
import Link from "next/link";
import SteltaLogo from '../../images/logo.png';
import styles from "./Header.module.css";
export default function Header() {
    const authContext = useAuth()
    return (
        <header className={styles.header}>
            <Link href='/'><Image src={SteltaLogo} alt={"Stelta logo"} width={120} height={65}></Image></Link>
            <div className={styles.navPanel}>
                <Link href="/" className={styles.navLink}>Торги</Link>
                <Link href="/search" className={styles.navLink}>Поиск</Link>
                <Link href="/companies" className={styles.navLink}>Организации</Link>
                <Link href="#settings" className={styles.navLink}>Аналитика</Link>
                {authContext.userName ? <Link href="/logout" className={styles.navLink}>Выйти</Link> : <Link href="/login" className={styles.navLink}>Войти</Link>}
            </div>
        </header>
    )
}