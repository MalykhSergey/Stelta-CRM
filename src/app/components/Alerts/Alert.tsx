"use client"
import { faCheck, faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import styles from "./Alert.module.css";
enum AlertType {
  successful = "successful", error = "error"
}
class Alert {
  type: AlertType = AlertType.error
  hiding: boolean = false
  deleted: boolean = false
  message: string = ""
  timers: NodeJS.Timeout[] = []
  id = 0
  constructor(message: string, type: string) {
    this.message = message
    if (type === 'successful') {
      this.type = AlertType.successful
    }
    else {
      this.type = AlertType.error
    }
    makeAutoObservable(this)
    this.timers.push(setTimeout(() => {
      this.hiding = true
    }, 1500),
      setTimeout(() => {
        this.deleted = true
      }, 4500))
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

export const showMessage = (message: string, type: string = 'error') => {
  alertStorage.push(new Alert(message, type))
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
        <div>{alert.message}</div>
      </div>
    )
  })
  return (
    <div className={styles.container} id="alerts-container">
      {messages}
    </div>
  )
});