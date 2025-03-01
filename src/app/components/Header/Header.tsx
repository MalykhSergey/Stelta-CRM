"use client"
import { useAuth } from '@/app/AuthContext';
import Image from 'next/image';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import SteltaLogo from '../../../static/images/logo.png';
import { showMessage } from '../Alerts/Alert';
import styles from "./Header.module.css";

export default function Header() {
    const authContext = useAuth()
    const pathname = usePathname()
    useEffect(() => {
        if (!authContext.user.name) return
        if (localStorage.getItem("version") != process.env.APP_VERSION)
            showMessage(`Новая версия ${process.env.APP_VERSION}. <a href="/changelog">Узнать больше</a>`, "info", 3000)
        localStorage.setItem("version", process.env.APP_VERSION || 'error')
    }, [authContext.user.name])
    return (
        <header id={styles.header}>
            {authContext.user.name ? <Link href='/'><Image src={SteltaLogo} alt={"Stelta logo"} id={styles.logo}></Image></Link> : <Image src={SteltaLogo} alt={"Stelta logo"} id={styles.logo}></Image>}
            <div className={styles.navPanel}>
                {authContext.user.name && <>
                    <Link href="/" className={`${styles.navLink} ${pathname == '/' ? styles.active : ''}`}>Торги</Link>
                    <Link href="/search"
                        className={`${styles.navLink} ${pathname == '/search' ? styles.active : ''}`}>Поиск</Link>
                    <Link href="/companies"
                        className={`${styles.navLink} ${pathname == '/companies' ? styles.active : ''}`}>Организации</Link>
                    <Link href="/analytics/date"
                        className={`${styles.navLink} ${pathname.includes('analytics') ? styles.active : ''}`}>Аналитика</Link>
                </>
                }
                {authContext.user.name ? <Link href="/logout" className={styles.navLink}>{authContext.user.name} | Выйти</Link> :
                    <Link href="/login"
                        className={`${styles.navLink} ${pathname == '/login' ? styles.active : ''}`}>Войти</Link>}
            </div>
        </header>
    )
}