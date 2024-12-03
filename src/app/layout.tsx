import {Inconsolata, Montserrat, Roboto} from 'next/font/google';
import {AuthProvider} from "./AuthContext";
import {AlertContainer} from "./components/Alerts/Alert";
import Header from "./components/Header/Header";
import "../static/styles/globals.css";
import styles from "./layout.module.css";
import {authAction} from "@/models/UserService";
import "@/static/styles/buttons.css";
import "@/static/styles/inputs.css";
import "@/static/styles/stageForm.css";

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
    const user_result = await authAction(async (user) => user.name)
    const auth_user = typeof user_result == 'string' ? user_result : ''
    return (
        <html lang="en">
        <body className={`${MontserratFont.variable} ${RobotoFont.variable} ${InconsolateFont.variable}`}>
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
