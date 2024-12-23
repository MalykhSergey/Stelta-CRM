import styles from './ConfirmDialog.module.css';
import {PrimaryButton} from "@/app/components/Buttons/PrimaryButton/PrimaryButton";

type ConfirmDialogProps = {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({message, onConfirm, onCancel}) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <h3>Подтверждение удаления</h3>
                <p>{message}</p>
                <div className={styles.buttons}>
                    <button onClick={onCancel} type='button'>Нет</button>
                    <PrimaryButton onClick={onConfirm}>Да</PrimaryButton>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
