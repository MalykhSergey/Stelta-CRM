import FileName from '@/app/models/FileName';
import { faCaretUp, faDownload, faPaperclip, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useRef } from 'react';
import { useConfirmDialog } from '../Dialog/ConfirmDialogContext';
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
    className?: string,
    independent?: boolean,
    onDelete?: () => void
}
const DocumentsForm: React.FC<DocumentsFormProps> = observer(({ tenderId, stage, specialPlaceName = 'default', specialPlaceId = 0, fileNames, pushFile, removeFile, title, isEditable, className = '', independent, onDelete = () => { } }) => {
    const collapsed = useLocalObservable(() => ({
        isTrue: true,
        toggle() { this.isTrue = !this.isTrue }
    }));
    const { showConfirmDialog } = useConfirmDialog();
    const fileInput = useRef<HTMLInputElement>(null)
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData();
        if (e.target.files)
            for (let i = 0; i < e.target.files.length; i++) {
                const file_name = encodeURI(e.target.files[i].name)
                formData.append('file', e.target.files[i], file_name);
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
        files.push(
            <div className={styles.fileItem} key={fileName.name + files.length}>
                <a href={`/download/${tenderId}/${fileName.id}/${fileName.name}`} download>{fileName.name} <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon></a>
                <button onClick={() => {
                    showConfirmDialog(
                        {
                            message: `Вы действительно хотите удалить ${fileName.name}?`,
                            onConfirm: () => {
                                removeFile(fileName)
                                deleteHandler(tenderId, fileName.id)
                            }
                        })
                }}
                    className='iconButton redButton'
                ><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></button></div>)
    }
    return (
        <div className={`${className} dynamicSizeForm ${collapsed.isTrue ? 'expanded' : ''}`}>
            <div className='cardHeader'>
                <h3>{title}</h3>
                <button className={`iconButton toggler`} onClick={collapsed.toggle}><FontAwesomeIcon icon={faCaretUp} className={`${styles.icon} ${!collapsed.isTrue ? 'rotated' : ''}`} /></button>
                {independent && <button className={`iconButton redButton`} onClick={() => {
                    showConfirmDialog(
                        {
                            message: `Вы действительно хотите удалить?`,
                            onConfirm: onDelete
                        })
                }}><FontAwesomeIcon icon={faXmark} /></button>}
            </div>
            <div className='hiddenContent'>
                {files}
                {
                    isEditable &&
                    <div >
                        <button
                            onClick={() => {
                                if (fileInput.current)
                                    fileInput.current.click()
                            }}
                            className='iconButton'
                        ><FontAwesomeIcon icon={faPaperclip} /></button>
                        <input ref={fileInput} onChange={handleChange} type="file" name="file" multiple hidden />
                        <input type="hidden" name="tenderId" value={tenderId} />
                    </div>
                }
            </div>
        </div >
    )
});
export default DocumentsForm
