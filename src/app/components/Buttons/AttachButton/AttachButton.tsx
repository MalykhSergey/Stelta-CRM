import styles from './AttachButton.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperclip} from "@fortawesome/free-solid-svg-icons";

interface AttachButtonProps {
    onClick: () => void;
    className?: string;
}

export const AttachButton: React.FC<AttachButtonProps> = ({onClick, className, ...rest}) => {
    return (
        <button onClick={onClick} className={`${styles.AttachButton} ${className}`} {...rest} aria-label="Прикрепить">
            <FontAwesomeIcon icon={faPaperclip}/>
        </button>
    );
};