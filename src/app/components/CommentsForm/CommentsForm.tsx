import { Status } from '@/app/models/Status';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Tender } from '../../models/Tender';
import styles from './CommentsForm.module.css';

interface CommentsFormProps {
    tender: Tender
}

const CommentsForm: React.FC<CommentsFormProps> = observer(({ tender }) => {
    let collapsed = useLocalObservable(() => ({
        isTrue: false,
        icon: faCaretDown,
        toggle() { this.isTrue = !this.isTrue }
    }));
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        tender.comments[tender.status] = e.target.value
    }
    let comments = []
    for (let i = 0; i < tender.status; i++) {
        if (tender.comments.length > i && tender.comments[i] != '') {
            comments.push(<label key={`label_${i}`} className={styles.label}>{Object.values(Status)[i]}</label>)
            comments.push(<p key={`p_${i}`}>{tender.comments[i]}</p>)
        }
    }
    comments.push(<label key={`label_${tender.status}`} className={styles.label}>{Object.values(Status)[tender.status]}</label>)
    comments.push(<textarea key='textarea' className={styles.input} onChange={handleChange} value={tender.comments[tender.status]}></textarea>)
    return (
        <div className={styles.form}>
            <h3>Комментарии <button className={styles.button} onClick={collapsed.toggle}><FontAwesomeIcon icon={faCaretDown} className={`${styles.icon} ${!collapsed.isTrue ? styles.rotated : ''}`} /></button></h3>
            {collapsed.isTrue && comments}
        </div>
    )
});
export default CommentsForm