import styles from './DeleteButton.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";


interface DeleteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>  {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({onClick, className, ...rest}) => {
    return (
        <button 
            onClick={onClick} 
            className={`${styles.DeleteButton} ${className}`} 
            aria-label="Удалить"
            {...rest}
        >
            <FontAwesomeIcon icon={faTrash}/>
        </button>
    );
};