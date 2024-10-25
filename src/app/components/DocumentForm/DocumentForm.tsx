import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { Tender } from '../../models/Tender';
import styles from './DocumentFrom.module.css';
import uploadHadler from './Handler';
interface DocumentsFormProps {
    tender: Tender
}
const DocumentsForm: React.FC<DocumentsFormProps> = observer(({ tender }) => {
    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.currentTarget.requestSubmit()
        console.log(e.target.files)
        for (let file of e.target.files){
            tender.fileNames.push(file.name)
        }
    }
    let files = []
    for (let fileName of tender.fileNames) {
        files.push(<p key={fileName+files.length}><a href={`/download/${fileName}`} download>{fileName}</a></p>)
    }
    return (
        <form className={`${styles.form} card`} action={uploadHadler} onChange={handleChange}>
            <h3>Файлы</h3>
            {files}
            <input type="file" name="file" multiple/>
            <input type="hidden" name="tenderId" value={tender.id} />
        </form>
    )
});
export default DocumentsForm