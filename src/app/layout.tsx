import localFont from "next/font/local";
import {AuthProvider} from "./AuthContext";
import {AlertContainer} from "./components/Alerts/Alert";
import Header from "./components/Header/Header";
import "../static/styles/globals.css";
import styles from "./layout.module.css";
import {authAction} from "../models/UserService";
import "../static/styles/buttons.css";
import "../static/styles/inputs.css";
import "../static/styles/stageForm.css";

const firaSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const user_result = await authAction(async (user) => user.name)
    const auth_user = typeof user_result == 'string' ? user_result : ''
    return (
        <html lang="en">
        <body className={`${firaSans.variable}`}>
        <div className='background'></div>
        <AlertContainer></AlertContainer>
        <AuthProvider initialAuth={auth_user}>
            <Header></Header>
            <div className={styles.content}>
                {children}
            </div>
        </AuthProvider>
        </body>
        </html>
    );
}
