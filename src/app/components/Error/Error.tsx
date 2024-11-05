"use client"
import { createContext, useContext, useState } from "react";
import styles from './Error.module.css'

interface ErrorContextProps {
    showError: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [error, setError] = useState<string | null>(null);

    const showError = (message: string) => {
        setError(message);
        setTimeout(() => setError(null), 5000);
    };

    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}
            {error && <ErrorMessage message={error} />}
        </ErrorContext.Provider>
    );
};

export const useError = (): ErrorContextProps => {
    const context = useContext(ErrorContext);
    if (!context) throw new Error('Попытка использования useError без ErrorProvider!');
    return context;
};

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    <div className={styles.error}>
        {message}
    </div>
);

export default ErrorMessage;
