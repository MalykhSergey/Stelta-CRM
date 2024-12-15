import styles from './IconButton.module.css'

interface IconButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({onClick, children, ...rest}) => {
    return (
        <button onClick={onClick} className={`${styles.IconButton}`} {...rest}>
            {children}
        </button>
    );
};