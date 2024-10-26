import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Tender } from '../../models/Tender';
import styles from './DocumentFrom.module.css';
interface DocumentsFormProps {
    tender: Tender
}
const DocumentsForm: React.FC<DocumentsFormProps> = observer(({ tender }) => {
    let collapsed = useLocalObservable(() => ({
        isTrue: true,
        toggle() { this.isTrue = !this.isTrue }
    }));
    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.currentTarget.requestSubmit()
        console.log(e.target.files)
        for (let file of e.target.files) {
            tender.fileNames.push(file.name)
        }
    }
    let files = []
    for (let fileName of tender.fileNames) {
        files.push(<p key={fileName + files.length}><a href={`/download/${fileName}`} download>{fileName}</a></p>)
    }
    return (
        <div className={`card ${styles.form} ${collapsed.isTrue ? styles.expanded : ''}`}><h3>Файлы <button className={styles.button} onClick={collapsed.toggle}><FontAwesomeIcon icon={faCaretUp} className={`${styles.icon} ${!collapsed.isTrue ? styles.rotated : ''}`} /></button></h3>
            <form>
                {files}
                <input type="file" name="file" multiple />
                <input type="hidden" name="tenderId" value={tender.id} />
            </form>
        </div>
    )
});
export default DocumentsForm