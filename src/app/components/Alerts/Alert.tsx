import { faCheck, faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Alert.module.css";
let timer_1: NodeJS.Timeout | undefined;
let timer_2: NodeJS.Timeout | undefined;
export const showMessage = (message: string, type:string = 'error') => {
    const alert = document.getElementById(`${type}-alert`)
    const alert_text = document.getElementById(`${type}-text`)
    if (alert && alert_text) {
        alert_text.textContent = message
        alert.style.display = "flex"
        alert.style.opacity = '1'
        clearTimeout(timer_1)
        clearTimeout(timer_2)
        timer_1 = setTimeout(() => { alert.style.opacity = '0' }, 4000);
        timer_2 = setTimeout(() => { alert.style.display = "none" }, 7000);
    }
};

export const doWithErrorCheck = async (doFunc: () => any) => {
    const result = await doFunc()
    if (result.error)
        showMessage(result.error)
    else return result
}

export const AlertContainer = () => (
    <div className={styles.container}>
        <div className={`${styles.error} ${styles.alert}`} id="error-alert"><FontAwesomeIcon icon={faExclamation} style={{ height: '20px'}}></FontAwesomeIcon><div id="error-text"></div></div>
        <div className={`${styles.successful} ${styles.alert}`} id="successful-alert"><FontAwesomeIcon icon={faCheck} style={{ height: '20px'}}></FontAwesomeIcon><div id="successful-text"></div></div>
    </div>
);