import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Tender } from '../../models/Tender';
import styles from './DocumentForm.module.css';
import { deleteHandler, uploadHandler } from './Handler';
interface DocumentsFormProps {
    tender: Tender,
    title: string,
    isEditable: boolean,
}
const DocumentsForm: React.FC<DocumentsFormProps> = observer(({ tender, title, isEditable }) => {
    let collapsed = useLocalObservable(() => ({
        isTrue: true,
        toggle() { this.isTrue = !this.isTrue }
    }));
    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        const formData = new FormData();
        for (let file of e.target.files) {
            tender.fileNames.push(file.name)
            let file_name = encodeURI(file.name)
            formData.append('file', file, file_name);
        }
        formData.append('tenderId', tender.id.toString());
        uploadHandler(formData)
    }
    let files = []
    for (let fileName of tender.fileNames) {
        files.push(<p key={fileName.name + files.length}><a href={`/download/${fileName}`} download>{fileName.name}</a><button onClick={() => {
            tender.fileNames = tender.fileNames.filter(file => fileName.name != file.name)
            deleteHandler(fileName.id)
        }}>Delete</button></p>)
    }
    return (
        <div className={`card ${styles.form} ${collapsed.isTrue ? styles.expanded : ''}`}><h3>{title} <button className={styles.toggler} onClick={collapsed.toggle}><FontAwesomeIcon icon={faCaretUp} className={`${styles.icon} ${!collapsed.isTrue ? styles.rotated : ''}`} /></button></h3>
            {files}
            {isEditable &&
                <form onChange={handleChange}>
                    <input type="file" name="file" multiple />
                    <input type="hidden" name="tenderId" value={tender.id} />
                </form>
            }
        </div>
    )
});
export default DocumentsForm
