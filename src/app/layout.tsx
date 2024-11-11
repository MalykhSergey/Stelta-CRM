import localFont from "next/font/local";
import Image from 'next/image';
import Link from "next/link";
import "./globals.css";
import SteltaLogo from './images/logo.png';
import styles from "./layout.module.css";
import "./styles/inputs.css";
import "./styles/buttons.css";
import "./styles/stageForm.css";
import { ErrorMessage } from "./components/Error/Error";
const firaSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${firaSans.variable}`}>
        <div className='background'></div>
        <header className={styles.header}>
          <Link href='/'><Image src={SteltaLogo} alt={"Stelta logo"} width={120} height={65}></Image></Link>
          <div className={styles.navPanel}>
            <Link href="#documents" className={styles.navLink}>Торги</Link>
            <Link href="#home" className={styles.navLink}>Поиск</Link>
            <Link href="#contacts" className={styles.navLink}>Организации</Link>
            <Link href="#settings" className={styles.navLink}>Аналитика</Link>
          </div>
        </header>
        <ErrorMessage></ErrorMessage>
          <div className={styles.content}>
            {children}
          </div>        
      </body>
    </html>
  );
}
