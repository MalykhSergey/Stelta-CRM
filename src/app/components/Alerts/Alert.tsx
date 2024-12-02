import { faCheck, faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Alert.module.css";
const timers: { [x: string]: (NodeJS.Timeout | number)[] } = {
    error: [0, 0],
    successful: [0, 0],
};
export const showMessage = (message: string, type: string = 'error') => {
    const alert = document.getElementById(`${type}-alert`)
    const alert_text = document.getElementById(`${type}-text`)
    if (alert && alert_text) {
        alert_text.textContent = message
        alert.style.display = "flex"
        alert.style.opacity = '1'
        clearTimeout(timers[type][0])
        clearTimeout(timers[type][1])
        timers[type][0] = setTimeout(() => { alert.style.opacity = '0' }, 4000);
        timers[type][1] = setTimeout(() => { alert.style.display = "none" }, 7000);
    }
};

export const AlertContainer = () => (
    <div className={styles.container}>
        <div className={`${styles.error} ${styles.alert}`} id="error-alert"><FontAwesomeIcon icon={faExclamation} style={{ height: '20px' }}></FontAwesomeIcon><div id="error-text"></div></div>
        <div className={`${styles.successful} ${styles.alert}`} id="successful-alert"><FontAwesomeIcon icon={faCheck} style={{ height: '20px' }}></FontAwesomeIcon><div id="successful-text"></div></div>
    </div>
);