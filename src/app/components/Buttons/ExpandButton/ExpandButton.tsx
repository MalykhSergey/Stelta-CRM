import styles from './ExpandButton.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretUp} from "@fortawesome/free-solid-svg-icons";

interface ExpandButtonProps {
    onClick: () => void;
    expanded: boolean;
    className?: string;
}

export const ExpandButton: React.FC<ExpandButtonProps> = ({onClick, expanded,className, ...rest}) => {
    return (
        <button onClick={onClick} className={`${styles.ExpandButton} ${className} ${expanded ? styles.rotated : ''}`} {...rest}>
            <FontAwesomeIcon icon={faCaretUp}/>
        </button>
    );
};