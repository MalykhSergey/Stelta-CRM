import styles from './CloseButton.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

interface CloseButtonProps {
    onClick: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = ({onClick, ...rest}) => {
    return (
        <button onClick={onClick} className={styles.CloseButton} {...rest}>
            <FontAwesomeIcon icon={faXmark}/>
        </button>
    );
};