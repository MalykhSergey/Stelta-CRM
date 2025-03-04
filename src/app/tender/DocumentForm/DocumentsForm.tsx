import FileName from '@/models/Tender/FileName';
import {faDownload, faSpinner} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {observer, useLocalObservable} from 'mobx-react-lite';
import {useRef} from 'react';
import {useConfirmDialog} from '../../components/Dialog/ConfirmDialogContext';
import styles from './DocumentsForm.module.css';
import {CloseButton} from "@/app/components/Buttons/CloseButton/CloseButton";
import {ExpandButton} from "@/app/components/Buttons/ExpandButton/ExpandButton";
import StageStyles from "@/app/tender/StageForms.module.css";
import {AttachButton} from "@/app/components/Buttons/AttachButton/AttachButton";
import {DeleteButton} from "@/app/components/Buttons/DeleteButton/DeleteButton";
import ExpandableForm from "@/app/components/ExpandableForm/ExpandableForm";
import DocumentsFileStorage from "@/app/tender/DocumentForm/DocumentsFileStorage";

// import {showMessage} from "@/app/components/Alerts/Alert";

interface DocumentsFormProps {
    tenderId: number,
    specialPlaceName?: string,
    specialPlaceId?: number,
    fileNames: FileName[],
    title: string,
    isEditable: boolean,
    isShowDelete?: boolean,
    isOpened?: boolean,
    onDelete?: () => void
}

const SUFFIX = `/api/download/?fileName`;

const DocumentsForm: React.FC<DocumentsFormProps> = observer(
    ({
         tenderId,
         specialPlaceName = 'default',
         specialPlaceId = 0,
         fileNames,
         title,
         isEditable,
         isShowDelete: isShowDelete,
         onDelete = () => {
         },
         isOpened = false,
     }) => {
        const {showConfirmDialog} = useConfirmDialog();
        const file_storage = useLocalObservable(() => new DocumentsFileStorage(fileNames))
        const fileInput = useRef<HTMLInputElement>(null)
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files)
                for (let i = 0; i < e.target.files.length; i++) {
                    const file = e.target.files[i]
                    const encodedFileName = encodeURIComponent(file.name)
                    file_storage.add_file(encodedFileName, tenderId, specialPlaceName, specialPlaceId, file)
                }
        }

        function deleteClickHandler(fileName: FileName) {
            return () => {
                showConfirmDialog(
                    {
                        message: `Вы действительно хотите удалить ${fileName.name}?`,
                        onConfirm: async () => file_storage.remove_file(fileName)
                    })
            };
        }

        const files = file_storage.files.map((fileName: FileName, index) => {
            return (
                <div className={`${styles.fileItem} ${fileName.id < 1 ? styles.uploading : ''}`}
                     key={'files' + index}>
                    <div>
                        <a href={`${SUFFIX}=${encodeURIComponent(FileName.getFilePath(fileName))}`}
                           download>{fileName.name}</a>
                    </div>
                    <div className={styles.buttonRow}>
                        <a href={`${SUFFIX}=${encodeURIComponent(FileName.getFilePath(fileName))}`} download>
                            <FontAwesomeIcon icon={faDownload}/>
                        </a>
                        {isEditable && fileName.id > 0 && <DeleteButton onClick={deleteClickHandler(fileName)}/>}
                    </div>
                </div>
            )
        })
        const uploading_files = file_storage.uploading_files.map((uploading_file: {
            file_name: FileName;
            progress: number;
            request: XMLHttpRequest
        }, index) => {
            return (
                <div className={`${styles.fileItem} ${styles.uploading}`}
                     key={`uploading${index}`}>
                    <div>
                        {<span className={styles.title}>{uploading_file.file_name.name}</span>}
                    </div>
                    <div className={styles.buttonRow}>
                        <span className={styles.progress}>{uploading_file.progress} %</span>
                        <FontAwesomeIcon className={styles.spinner} icon={faSpinner}/>
                        <CloseButton onClick={() => file_storage.cancel_uploading(uploading_file)}/>
                    </div>
                </div>
            )
        })
        return (<ExpandableForm
            start_value={isOpened && fileNames.length > 0}
            aria-label={title}
            header={(toggle, isExpanded) => {
                return (
                    <div className={StageStyles.cardHeader}>
                        <h3>{title}</h3>
                        {isEditable &&
                            <div>
                                <AttachButton onClick={() => {
                                    if (fileInput.current) fileInput.current.click()
                                }}/>
                                <input ref={fileInput} onChange={async (e) => {
                                    handleChange(e)
                                    if (!isExpanded) toggle()
                                }}
                                       type="file" name="file" multiple hidden/>
                            </div>
                        }
                        <div className={StageStyles.rightPanel}>
                            {fileNames.length > 0 && <ExpandButton onClick={toggle} expanded={!isExpanded}/>}
                            {isShowDelete && isEditable &&
                                <CloseButton onClick={() => {
                                    showConfirmDialog({
                                        message: `Вы действительно хотите удалить?`,
                                        onConfirm: onDelete
                                    })
                                }}/>
                            }
                        </div>
                    </div>
                )
            }}>
            {files}
            {uploading_files}
        </ExpandableForm>)
    });
export default DocumentsForm
