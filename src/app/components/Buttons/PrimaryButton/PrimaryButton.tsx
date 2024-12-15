import styles from './PrimaryButton.module.css'

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: () => void;
    children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({onClick, children, ...rest}) => {
    return (
        <button onClick={onClick} className={styles.PrimaryButton} {...rest}>
            {children}
        </button>
    );
};