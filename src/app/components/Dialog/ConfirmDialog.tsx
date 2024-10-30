import styles from './ConfirmDialog.module.css';

type ConfirmDialogProps = {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <p>{message}</p>
                <div className={styles.buttons}>
                    <button onClick={onCancel}>Нет</button>
                    <button onClick={onConfirm}>Да</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
