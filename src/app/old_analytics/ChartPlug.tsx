import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartSimple} from "@fortawesome/free-solid-svg-icons";
import styles from "./ChartPlug.module.css"

export default function ChartPlug() {
    return <div className={styles.container}>
        <FontAwesomeIcon icon={faChartSimple} className={styles.icon}/>
        <p>Данных для построения графика недостаточно</p>
    </div>
}