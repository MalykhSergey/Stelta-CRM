import FileName from '@/models/Tender/FileName';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {observer, useLocalObservable} from 'mobx-react-lite';
import {useRef} from 'react';
import {useConfirmDialog} from '../../components/Dialog/ConfirmDialogContext';
import styles from './DocumentsForm.module.css';
import {deleteHandler, uploadHandler} from './Handler';
import {showMessage} from "@/app/components/Alerts/Alert";
import {CloseButton} from "@/app/components/Buttons/CloseButton/CloseButton";
import {ExpandButton} from "@/app/components/Buttons/ExpandButton/ExpandButton";
import StageStyles from "@/app/tender/StageForms.module.css";
import {AttachButton} from "@/app/components/Buttons/AttachButton/AttachButton";
import {DeleteButton} from "@/app/components/Buttons/DeleteButton/DeleteButton";

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
    isOpened?: boolean,
    onDelete?: () => void
}

const DocumentsForm: React.FC<DocumentsFormProps> = observer(({
                                                                  tenderId,
                                                                  stage,
                                                                  specialPlaceName = 'default',
                                                                  specialPlaceId = 0,
                                                                  fileNames,
                                                                  pushFile,
                                                                  removeFile,
                                                                  title,
                                                                  isEditable,
                                                                  className = '',
                                                                  independent,
                                                                  onDelete = () => {
                                                                  }
                                                              }, isOpened = false) => {
    const collapsed = useLocalObservable(() => ({
        isTrue: isOpened,
        toggle() {
            this.isTrue = !this.isTrue
        }
    }));
    const {showConfirmDialog} = useConfirmDialog();
    const fileInput = useRef<HTMLInputElement>(null)
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData();
        if (!collapsed.isTrue)
            collapsed.toggle()
        if (e.target.files)
            for (let i = 0; i < e.target.files.length; i++) {
                const file_name = encodeURI(e.target.files[i].name)
                formData.append('file', e.target.files[i], file_name);
            }
        formData.append('stage', stage.toString());
        formData.append('tenderId', tenderId.toString());
        formData.append(specialPlaceName, specialPlaceId.toString());
        const result = await uploadHandler(formData)
        if (Array.isArray(result))
            for (const newFile of result as FileName[])
                pushFile(newFile)
        else
            showMessage(result.error)
    }
    const files = []

    function deleteClickHandler(fileName: FileName) {
        return () => {
            showConfirmDialog(
                {
                    message: `Вы действительно хотите удалить ${fileName.name}?`,
                    onConfirm: async () => {
                        const result = await deleteHandler(tenderId, fileName.id)
                        if (result?.error) {
                            showMessage(result.error)
                        } else
                            removeFile(fileName)
                    }
                })
        };
    }

    for (const fileName of fileNames) {
        files.push(
            <div className={styles.fileItem} key={fileName.name + files.length}>
                <a href={`/download/${tenderId}/${fileName.id}/${fileName.name}`} download>
                    {fileName.name}<FontAwesomeIcon icon={faDownload}></FontAwesomeIcon></a>
                {isEditable && <DeleteButton onClick={deleteClickHandler(fileName)}/>}
            </div>)
    }
    return (
        <div className={`${className} ${StageStyles.dynamicSizeForm}  ${collapsed.isTrue ? StageStyles.expanded : ''}`} data-testid="documents-container">
            <div className={StageStyles.cardHeader}>
                <h3>{title}</h3>
                {
                    isEditable &&
                    <div>
                        <AttachButton onClick={() => {
                            if (fileInput.current) fileInput.current.click()
                        }}/>
                        <input ref={fileInput} onChange={handleChange} type="file" name="file" multiple hidden/>
                        <input type="hidden" name="tenderId" value={tenderId}/>
                    </div>
                }
                <div className={StageStyles.rightPanel}>
                    {fileNames.length > 0 &&
                        <ExpandButton onClick={collapsed.toggle} expanded={!collapsed.isTrue}/>}
                    {independent && isEditable &&
                        <CloseButton onClick={() => {
                            showConfirmDialog({
                                message: `Вы действительно хотите удалить?`,
                                onConfirm: onDelete
                            })
                        }}/>
                    }
                </div>
            </div>
            <div className={StageStyles.hiddenContent}>
                {files}
            </div>
        </div>
    )
});
export default DocumentsForm
