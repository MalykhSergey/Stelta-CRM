import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Tender } from '../../models/Tender';
import DocumentsForm from '../DocumentForm/DocumentForm';
import styles from './StageForm_1.module.css';
interface StageForm_1Props {
    tender: Tender,
    title: string,
    isEditable: boolean,
}
const StageForm_1: React.FC<StageForm_1Props> = observer(({ tender, title, isEditable }) => {
    let collapsed = useLocalObservable(() => ({
        isTrue: true,
        toggle() { this.isTrue = !this.isTrue }
    }));
    // let input_file = useRef(null)
    const handleClick = () => {
        // input_file.current.click()
    }
    // const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.currentTarget.files)
    //         for (let file of e.currentTarget.files) {
    //             tender.fileNames.push(file.name)
    //         }
    // }
    let files = []
    for (let fileName of tender.fileNames) {
        files.push(<p key={fileName + files.length}><a href={`/download/${fileName}`} download>{fileName}</a></p>)
    }
    return (
        <div className={`card ${styles.form} ${collapsed.isTrue ? styles.expanded : ''}`}><h3>Этап 1 <button className={styles.toggler} onClick={collapsed.toggle}><FontAwesomeIcon icon={faCaretUp} className={`${styles.icon} ${!collapsed.isTrue ? styles.rotated : ''}`} /></button></h3>
            <DocumentsForm tender={tender} title='Формы 1 этапа' isEditable={true}></DocumentsForm>
            <button onClick={handleClick}>Дозапрос документов</button>
            {/* <input ref={input_file} onChange={handleInputFile} type="file" name="file" hidden multiple /> */}
        </div>
    )
});
export default StageForm_1