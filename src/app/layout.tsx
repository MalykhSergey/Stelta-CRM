import localFont from "next/font/local";
import "./globals.css";
import styles from "./layout.module.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={styles.sidebar}>
          <nav className={styles.nav}>
            <ul>
              <li>
                <div className={styles.iconPlaceholder}></div>
                <span className={styles.menuText}>Navigation Item 1</span>
              </li>
              <li>
                <div className={styles.iconPlaceholder}></div>
                <span className={styles.menuText}>Navigation Item 2</span>
              </li>
              <li>
                <div className={styles.iconPlaceholder}></div>
                <span className={styles.menuText}>Navigation Item 3</span>
              </li>
              <li>
                <div className={styles.iconPlaceholder}></div>
                <span className={styles.menuText}>Navigation Item 4</span>
              </li>
            </ul>
          </nav>
        </div>
        <div className={styles.overlay}></div>
        <main className={styles.main}>
          {/* <TenderStorageContext.Provider value={tenderStorage}></TenderStorageContext.Provider> */}
          {children}
        </main>
      </body>
    </html>
  );
}
