import styles from "./Error.module.css";
export const showError = (message: string) => {
    const error = document.getElementById("error-message")
    if (error) {
        error.textContent = message
        error.style.display = "block"
        error.style.opacity = '1'
        setTimeout(() => { error.style.opacity = '0' }, 4000);
        setTimeout(() => { error.style.display = "none" }, 7000);
    }
};

export const doWithErrorCheck = async (doFunc: ()=>any) => {
    const result = await doFunc()
    if(result.error)
        showError(result.error)
    else return result
}

export const ErrorMessage = () => (
    <div className={styles.error} id="error-message">
    </div>
);