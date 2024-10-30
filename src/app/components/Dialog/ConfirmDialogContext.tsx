import React, { createContext, ReactNode, useContext, useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

type ConfirmDialogOptions = {
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
};

type ConfirmDialogContextType = {
    showConfirmDialog: (options: ConfirmDialogOptions) => void;
    hideConfirmDialog: () => void;
};

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export const useConfirmDialog = () => {
    const context = useContext(ConfirmDialogContext);
    if (!context) {
        throw new Error('Попытка использования useConfirmDialog без ConfirmDialogProvider!');
    }
    return context;
};

export const ConfirmDialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);

    const showConfirmDialog = (options: ConfirmDialogOptions) => {
        setOptions(options);
        setIsVisible(true);
    };

    const hideConfirmDialog = () => {
        setIsVisible(false);
    };

    return (
        <ConfirmDialogContext.Provider value={{ showConfirmDialog, hideConfirmDialog }}>
            {children}
            {isVisible && options && (
                <ConfirmDialog
                    message={options.message}
                    onConfirm={() => {
                        options.onConfirm();
                        hideConfirmDialog();
                    }}
                    onCancel={() => {
                        options.onCancel?.();
                        hideConfirmDialog();
                    }}
                />
            )}
        </ConfirmDialogContext.Provider>
    );
};
