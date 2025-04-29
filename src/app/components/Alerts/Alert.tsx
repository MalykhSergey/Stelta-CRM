"use client"
import { faCheck, faExclamation, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeAutoObservable } from "mobx";
import {enableStaticRendering, observer} from "mobx-react-lite";
import styles from "./Alert.module.css";
enableStaticRendering(typeof window === "undefined")
enum AlertType {
  successful = "successful", error = "error", info = "info"
}
class Alert {
  type: AlertType = AlertType.error
  hiding: boolean = false
  deleted: boolean = false
  message: string = ""
  timers: NodeJS.Timeout[] = []
  id = 0
  constructor(message: string, type: string, timeDelay = 0) {
    this.message = message
    if (type === 'successful') {
      this.type = AlertType.successful
    }
    else if (type === "error") {
      this.type = AlertType.error
    }
    else if (type === "info") {
      this.type = AlertType.info
    }
    makeAutoObservable(this)
    this.timers.push(setTimeout(() => {
      this.hiding = true
    }, 1500 + timeDelay),
      setTimeout(() => {
        this.deleted = true
      }, 4500 + timeDelay))
  }
}
class AlertStorage {
  id = 0
  messages: Alert[] = []

  constructor() {
    makeAutoObservable(this)
  }
  push(alert: Alert) {
    alert.id = this.id++
    this.messages.push(alert)
    alert.timers.push(setTimeout(() => {
      this.remove(alert)
    }, 6750))
  }
  remove(alert: Alert) {
    alert.timers.forEach(timer => {
      clearTimeout(timer)
    })
    this.messages = this.messages.filter(value => {
      return value.id !== alert.id
    })
  }
}

const alertStorage = new AlertStorage()

export const showMessage = (message: string, type: string = 'error', timeDelay = 0) => {
  alertStorage.push(new Alert(message, type, timeDelay))
};

export const AlertContainer = observer(() => {
  const handleClick = (alert: Alert) => {
    alertStorage.remove(alert)
  };
  const messages = alertStorage.messages.map((alert) => {
    let icon = faCheck
    if (alert.type === AlertType.error) {
      icon = faExclamation
    }
    if (alert.type === AlertType.info) {
      icon = faInfo
    }
    let isVisible = ""
    if (alert.hiding) {
      isVisible = styles.hidden
    }
    let isDeleted = ""
    if (alert.deleted) {
      isDeleted = styles.deleted
    }
    return (
      <div className={`${styles[alert.type]} ${styles.alert} ${isVisible} ${isDeleted}`} key={alert.id} onClick={() => handleClick(alert)} aria-label={alert.type}>
        <FontAwesomeIcon icon={icon} style={{ height: '20px' }} />
        <div dangerouslySetInnerHTML={{ __html: alert.message }} />
      </div>
    )
  })
  return (
    <div className={styles.container} id="alerts-container">
      {messages}
    </div>
  )
});