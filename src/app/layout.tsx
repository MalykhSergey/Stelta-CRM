import { checkAuth } from "@/models/User/UserService";
import "@/static/styles/buttons.css";
import "@/static/styles/inputs.css";
import { Inconsolata, Montserrat, Roboto } from 'next/font/google';
import "../static/styles/globals.css";
import { AuthProvider } from "./AuthContext";
import { AlertContainer } from "./components/Alerts/Alert";
import Header from "./components/Header/Header";
import styles from "./layout.module.css";

const MontserratFont = Montserrat({
    subsets: ['cyrillic'],
    variable: "--default-font",
});
const RobotoFont = Roboto({
    weight: ['700'],
    subsets: ['cyrillic'],
    variable: "--bold-title-font",
});
const InconsolateFont = Inconsolata({
    subsets: ['latin'],
    variable: "--numbers-font",
})

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const auth_user = await checkAuth()
    return (
        <html lang="en">
            <body className={`${MontserratFont.variable} ${RobotoFont.variable} ${InconsolateFont.variable}`}>
                <div className='background'></div>
                <AlertContainer></AlertContainer>
                <AuthProvider initialAuth={{ ...auth_user }}>
                    <Header></Header>
                    <div className={styles.content}>
                        {children}
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}
