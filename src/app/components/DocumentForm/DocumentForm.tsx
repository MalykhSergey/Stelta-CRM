import FileName from '@/app/models/FileName';
import { faCaretUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer, useLocalObservable } from 'mobx-react-lite';
import styles from './DocumentForm.module.css';
import { deleteHandler, uploadHandler } from './Handler';
interface DocumentsFormProps {
    tenderId: number,
    stage: number,
    specialPlaceName?: string,
    specialPlaceId?: number,
    fileNames: FileName[],
    pushFile: (fileName: FileName) => void,
    removeFile: (fileName: FileName) => void,
    title: string,
    isEditable: boolean,
}
const DocumentsForm: React.FC<DocumentsFormProps> = observer(({ tenderId, stage, specialPlaceName = 'default', specialPlaceId = 0, fileNames, pushFile, removeFile, title, isEditable }) => {
    const collapsed = useLocalObservable(() => ({
        isTrue: true,
        toggle() { this.isTrue = !this.isTrue }
    }));
    const handleChange = async (e: React.ChangeEvent<HTMLFormElement>) => {
        const formData = new FormData();
        for (const file of e.target.files) {
            const file_name = encodeURI(file.name)
            formData.append('file', file, file_name);
        }
        formData.append('stage', stage.toString());
        formData.append('tenderId', tenderId.toString());
        formData.append(specialPlaceName, specialPlaceId.toString());
        const newFiles = JSON.parse(await uploadHandler(formData)) as FileName[]
        for (const newFile of newFiles) {
            pushFile(newFile)
        }
    }
    const files = []
    for (const fileName of fileNames) {
        files.push(<p key={fileName.name + files.length}><a href={`/download/${tenderId}/${fileName.id}/${fileName.name}`} download>{fileName.name}</a><button onClick={() => {
            removeFile(fileName)
            deleteHandler(tenderId, fileName.id)
        }}>Delete</button></p>)
    }
    return (
        <div className={`card dynamicSizeForm ${collapsed.isTrue ? 'expanded' : ''}`}>
            <div className='cardHeader'>
                <h3>{title}</h3>
                <button className={`iconButton ${styles.toggler}`} onClick={collapsed.toggle}><FontAwesomeIcon icon={faCaretUp} className={`${styles.icon} ${!collapsed.isTrue ? styles.rotated : ''}`} /></button>
                <button className={`iconButton closeButton`}><FontAwesomeIcon icon={faXmark} className={``} /></button>
            </div>
            <div className='hiddenContent'>
                {files}
                {
                    isEditable &&
                    <form onChange={handleChange}>
                        <input type="file" name="file" multiple />
                        <input type="hidden" name="tenderId" value={tenderId} />
                    </form>
                }
            </div>
        </div >
    )
});
export default DocumentsForm
