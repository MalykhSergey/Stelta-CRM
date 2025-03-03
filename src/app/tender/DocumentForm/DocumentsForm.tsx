import FileName from '@/models/Tender/FileName';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {observer} from 'mobx-react-lite';
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
import ExpandableForm from "@/app/components/ExpandableForm/ExpandableForm";

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

const MAX_FILE_SIZE = 500 * 1024 * 1024

const DocumentsForm: React.FC<DocumentsFormProps> = observer(({
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
    const fileInput = useRef<HTMLInputElement>(null)
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const formData = new FormData();
        let size = 0
        if (e.target.files)
            for (let i = 0; i < e.target.files.length; i++) {
                const file_name = encodeURI(e.target.files[i].name)
                size += e.target.files[i].size
                if (size >= MAX_FILE_SIZE) {
                    showMessage(`Суммарный объём файлов превышает допустимый размер в 500 МБ. Будет загружена только часть файлов.`);
                    break;
                }
                formData.append('file', e.target.files[i], file_name);
            }
        formData.append('tenderId', tenderId.toString());
        formData.append(specialPlaceName, specialPlaceId.toString());
        const result = await uploadHandler(formData)
        if (Array.isArray(result))
            for (const newFile of result as FileName[])
                fileNames.push(newFile)
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
                        const result = await deleteHandler({...fileName})
                        if (result?.error) {
                            showMessage(result.error)
                        } else {
                            const index = fileNames.findIndex(item => item.name === fileName.name);
                            if (index > -1)
                                fileNames.splice(index, 1);
                        }
                    }
                })
        };
    }

    for (const fileName of fileNames) {
        files.push(
            <div className={styles.fileItem} key={fileName.name + files.length}>
                <a href={`/download/?fileName=${encodeURIComponent(FileName.getFilePath(fileName))}`} download>
                    {fileName.name}<FontAwesomeIcon icon={faDownload}></FontAwesomeIcon></a>
                {isEditable && <DeleteButton onClick={deleteClickHandler(fileName)}/>}
            </div>)
    }
    return (

        <ExpandableForm
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
                                    await handleChange(e)
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
        </ExpandableForm>
    )
});
export default DocumentsForm
