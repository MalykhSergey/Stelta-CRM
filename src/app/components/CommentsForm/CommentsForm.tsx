import getStatusName from '@/app/models/Status';
import {faCaretUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {observer, useLocalObservable} from 'mobx-react-lite';
import {Tender} from '../../models/Tender';
import styles from './CommentsForm.module.css';

interface CommentsFormProps {
    tender: Tender
}

const CommentsForm: React.FC<CommentsFormProps> = observer(({tender}) => {
    const collapsed = useLocalObservable(() => ({
        isTrue: false,
        toggle() {
            this.isTrue = !this.isTrue
        }
    }));
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        tender.comments[tender.status] = e.target.value
    }
    const comments = []
    for (let i = 0; i < tender.status; i++) {
        if (tender.comments.length > i && tender.comments[i] != '') {
            comments.push(<label key={`label_${i}`} className={styles.label}>{getStatusName(i)}</label>)
            comments.push(<p key={`p_${i}`} className={styles.comment}>{tender.comments[i]}</p>)
        }
    }
    comments.push(<label key={`label_${tender.status}`} className={styles.label}>{getStatusName(tender.status)}</label>)
    comments.push(<textarea key='textarea' className={styles.input} onChange={handleChange}
                            value={tender.comments[tender.status]}></textarea>)
    return (
        <div className={`card dynamicSizeForm ${collapsed.isTrue ? 'expanded' : ''}`}>
            <div className='cardHeader'>
                <h3>Комментарии</h3>
                <button className={`iconButton toggler rightPanel`} onClick={collapsed.toggle}><FontAwesomeIcon
                    icon={faCaretUp} className={` ${!collapsed.isTrue ? 'rotated' : ''}`}/></button>
            </div>
            <div className='hiddenContent' style={{marginTop: '0px'}}>
                {comments}
            </div>
        </div>
    )
});
export default CommentsForm