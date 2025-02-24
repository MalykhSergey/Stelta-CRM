import getStatusName from '@/models/Tender/Status';
import {observer} from 'mobx-react-lite';
import {Tender} from '@/models/Tender/Tender';
import styles from './CommentsForm.module.css';
import React from "react";
import StageStyles from "@/app/tender/StageForms.module.css";
import {ExpandButton} from "@/app/components/Buttons/ExpandButton/ExpandButton";
import ExpandableForm from "@/app/components/ExpandableForm/ExpandableForm";

interface CommentsFormProps {
    tender: Tender
}

const CommentsForm: React.FC<CommentsFormProps> = observer(({tender}) => {
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
        <ExpandableForm
            header={(toggle, isExpanded) => {
                return (
                    <div className={StageStyles.cardHeader}>
                        <h3>Комментарии</h3>
                        <ExpandButton onClick={toggle} className={StageStyles.rightPanel} expanded={!isExpanded}/>
                    </div>
                )}}>
            {comments}
        </ExpandableForm>
    )
});
export default CommentsForm