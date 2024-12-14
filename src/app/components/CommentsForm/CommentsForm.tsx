import getStatusName from '@/models/Status';
import {faCaretUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {observer, useLocalObservable} from 'mobx-react-lite';
import {Tender} from '@/models/Tender/Tender';
import styles from './CommentsForm.module.css';
import React from "react";

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
    const comments = tender.comments.map((comment, index) => {
        if (index < tender.status && comment !== '') {
            return (
                <React.Fragment key={index}>
                    <label className={styles.label}>{getStatusName(index)}</label>
                    <p className={styles.comment}>{comment}</p>
                </React.Fragment>
            );
        }
        return null;
    });
    comments.push(
        <React.Fragment key="textarea">
            <label className={styles.label} htmlFor='comment-input'>{getStatusName(tender.status)}</label>
            <textarea
                id='comment-input'
                className={styles.input}
                onChange={handleChange}
                value={tender.comments[tender.status]}
            />
        </React.Fragment>
    );
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