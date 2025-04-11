import {FC, SelectHTMLAttributes} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styles from './Select.module.css';
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";

type CustomSelectProps = SelectHTMLAttributes<HTMLSelectElement>

const CustomSelect: FC<CustomSelectProps> = ({children, ...rest}) => {
    return (
        <div className={styles.customSelectWrapper}>
            <select {...rest} className={styles.select}>{children}</select>
            <FontAwesomeIcon icon={faChevronDown} className={styles.chevronIcon}/>
        </div>
    )
}
export default CustomSelect;